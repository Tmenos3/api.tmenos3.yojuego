let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('../../common/Routes');
let AndroidNotification = require('./models/AndroidNotification');
let IOsNotification = require('./models/IOsNotification');
let Device = require('./models/Device');

class ServiceRoutes extends Routes {
    constructor(deviceRepo, notificationService) {
        super();

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(deviceRepo).throw(ServiceRoutes.INVALID_DEVICE_REPOSITORY));
        validator.addCondition(new NotNullOrUndefinedCondition(notificationService).throw(ServiceRoutes.INVALID_NOTIFICATION_SERVICE));

        validator.execute(() => {
            this._deviceRepo = deviceRepo;
            this._notificationService = notificationService;

            this._returnDevice = this._returnDevice.bind(this);
            this._registerDevice = this._registerDevice.bind(this);
            this._deleteDevice = this._deleteDevice.bind(this);
            this._updateDevice = this._updateDevice.bind(this);
            this._checkDevicesBeforeUpdate = this._checkDevicesBeforeUpdate.bind(this);
            this._getUsers = this._getUsers.bind(this);
            this._pushNotifications = this._pushNotifications.bind(this);
            this._returnSummary = this._returnSummary.bind(this);
            this._validateParameters = this._validateParameters.bind(this);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.put('/notification/register', super._bodyIsNotNull, this._registerDevice, this._returnDevice);
        server.del('/notification/:id', super._paramsIsNotNull, this._deleteDevice, this._returnDevice);
        server.post('/notification/update', super._bodyIsNotNull, this._checkDevicesBeforeUpdate, this._updateDevice, this._returnDevice);
        server.put('/notification/push', super._bodyIsNotNull, this._validateParameters, this._getUsers, this._pushNotifications, this._returnSummary);
    }

    _returnDevice(req, res, next) {
        req.device.deviceAudit = undefined;
        res.json(200, { code: 200, message: req.message, resp: req.device });
    }

    _registerDevice(req, res, next) {
        try {
            let device = new Device(req.body.userid, req.body.deviceid, req.body.type);
            device.deviceAudit = {
                createdBy: 'SERVICE',
                createdOn: new Date(),
                createdFrom: 'SERVICE',
                modifiedBy: null,
                modifiedOn: null,
                modifiedFrom: null
            }
            this._deviceRepo.getByDeviceIdAndType(device.deviceid, device.type)
                .then(resp => {
                    if (resp.resp) res.json(400, { code: 400, message: 'Device already registered', resp: null });
                    else return this._deviceRepo.add(device)
                        .then(resp => {
                            return this._deviceRepo.get(resp.resp._id);
                        })
                        .then(resp => {
                            req.device = resp.resp;
                            req.message = 'Device registered.';
                            next();
                        });
                })
                .catch(error => {
                    res.json(400, { code: 400, message: error.message, resp: null });
                });
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: null });
        }
    }

    _updateDevice(req, res, next) {
        req.device.deviceid = req.body.newdeviceid;
        req.device.deviceAudit.modifiedBy = 'SERVICE';
        req.device.deviceAudit.modifiedOn = new Date();
        req.device.deviceAudit.modifiedFrom = 'SERVICE';

        return this._deviceRepo.update(req.device)
            .then(resp => {
                req.message = 'Device deleted.';
                next();
            });
    }

    _checkDevicesBeforeUpdate(req, res, next) {
        if (!req.body.olddeviceid || !req.body.newdeviceid || !req.body.type)
            res.json(400, { code: 400, message: 'OldDeviceId, NewDeviceId and Type are required.', resp: null });
        else {
            this._deviceRepo.getByDeviceIdAndType(req.body.olddeviceid, req.body.type)
                .then(oldDeviceResp => {
                    if (!oldDeviceResp.resp) res.json(400, { code: 400, message: 'Device is not registered', resp: null });
                    else {
                        this._deviceRepo.getByDeviceIdAndType(req.body.newdeviceid, req.body.type)
                            .then(newDeviceResp => {
                                if (newDeviceResp.resp) res.json(400, { code: 400, message: 'Device is already registered', resp: null });
                                else {
                                    req.device = oldDeviceResp.resp;
                                    next();
                                }
                            });
                    }
                })
                .catch(error => {
                    res.json(400, { code: 400, message: error.message, resp: null });
                });
        }
    }

    _deleteDevice(req, res, next) {
        this._deviceRepo.get(req.params.id)
            .then(resp => {
                if (!resp.resp) res.json(400, { code: 400, message: 'Device is not registered', resp: null });
                else return this._deviceRepo.delete(resp.resp)
                    .then(resp => {
                        req.device = resp.resp;
                        req.message = 'Device deleted.';
                        next();
                    });
            })
            .catch(error => {
                res.json(400, { code: 400, message: error.message, resp: null });
            });
    }

    _validateParameters(req, res, next) {
        if (!req.body.userids) res.json(400, { code: 400, message: 'User IDs are required', resp: null });
        else if (!req.body.data) res.json(400, { code: 400, message: 'Data is required', resp: null });
        else next();
    }

    _getUsers(req, res, next) {
        let promises = [];

        req.body.userids.forEach(userid => {
            promises.push(
                this._deviceRepo.getByUserId(userid)
                    .then((resp) => {
                        return { userid, devices: resp.resp };
                    })
            );
        });

        Promise.all(promises)
            .then((rets) => {
                req.errors = rets.filter(r => { return !r.devices }).map(e => { return e.userid });
                req.devices = [].concat.apply([], rets.filter(r => { return r.devices !== null }).map(e => {
                    return e.devices.map(ee => { return ee });
                }));

                next();
            });
    }

    _pushNotifications(req, res, next) {
        let androidDevices = req.devices.filter(d => { return d.type === 'ANDROID' }).map(d => { return d.deviceid });
        let iosDevices = req.devices.filter(d => { return d.type === 'IOS' }).map(d => { return d.deviceid });
        let promises = [];

        if (androidDevices.length) {
            promises.push(
                this._notificationService.push(new AndroidNotification(androidDevices, req.body.data))
                    .then((resp) => {
                        //Separar los que dieron error de los que no para el summary
                        return androidDevices;
                    })
            );
        }

        if (iosDevices.length) {
            promises.push(
                this._notificationService.push(new IOsNotification(iosDevices, req.body.data))
                    .then((resp) => {
                        //Separar los que dieron error de los que no para el summary
                        return iosDevices;
                    })
            );
        }

        Promise.all(promises)
            .then((resp) => {
                //Separar los que dieron error de los que no para el summary
                req.devices = resp;

                next();
            });
    }

    _returnSummary(req, res, next) {
        let resp = {
            summary: {
                pushed: req.pushed,
                errors: req.errors
            }
        }
        res.json(200, { code: 200, message: 'Notifications pushed.', resp });
    }

    static get INVALID_DEVICE_REPOSITORY() {
        return 'El repositorio de devices no puede ser null ni undefined';
    }

    static get INVALID_NOTIFICATION_SERVICE() {
        return 'El notification service no puede ser null ni undefined';
    }
}

module.exports = ServiceRoutes;
