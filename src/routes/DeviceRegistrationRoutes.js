let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let DeviceESRepository = require('../repositories/DeviceESRepository');
let NotificationService = require('../NotificationService/NotificationService');
let Device = require('../models/Device');

let repo = null;
let ns = null;

class DeviceRegistrationRoutes extends Routes {
    constructor(esClient) {
        super();

        this._checkDeviceAndPlatform = this._checkDeviceAndPlatform.bind(this);
        this._registerDevice = this._registerDevice.bind(this);
        this._checkIfDeviceExists = this._checkIfDeviceExists.bind(this);
        this._verifyDeviceExists = this._verifyDeviceExists.bind(this);
        this._checkUser = this._checkUser.bind(this);
        this._deleteDevice = this._deleteDevice.bind(this);
        this._updateDevice = this._updateDevice.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(DeviceRegistrationRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new DeviceESRepository(esClient);
            ns = new NotificationService();
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/device/register', super._bodyIsNotNull, this._checkDeviceAndPlatform, this._checkIfDeviceExists, this._registerDevice);
        server.post('/device/:id', super._paramsIsNotNull, super._bodyIsNotNull, this._verifyDeviceExists, this._checkUser, this._updateDevice);
        server.del('/device/:id', super._paramsIsNotNull, this._verifyDeviceExists, this._checkUser, this._deleteDevice);
        server.post('/device/sendTest', (req, res, next) => {
            ns.notify(null);
            res.json(200, { id: 1 });
        });
    }

    _checkDeviceAndPlatform(req, res, next) {
        try {
            req.device = new Device(req.body.deviceId, req.body.platform, req.user._id);
            next();
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: null });
        }
    }

    _checkIfDeviceExists(req, res, next) {
        repo.getByUserIdDeviceIdAndPlatform(req.user._id, req.device.deviceId, req.device.platform)
            .then((response) => {
                if (response.resp.length) {
                    res.json(400, { code: 400, message: 'The device has already registered.', resp: null });
                } else {
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _registerDevice(req, res, next) {
        req.device.deviceAudit = {
            createdBy: req.user._id,
            createdOn: new Date(),
            createdFrom: 'MOBILE' /* This should be added to the token */,
            modifiedBy: null,
            modifiedOn: null,
            modifiedFrom: null
        }
        repo.add(req.device)
            .then((response) => {
                response.resp.deviceAudit = undefined;
                res.json(200, { code: 200, message: 'The device has been registered.', resp: response.resp });
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _verifyDeviceExists(req, res, next) {
        repo.get(req.params.id)
            .then((response) => {
                if (response.resp) {
                    res.json(400, { code: 400, message: 'Invalid device.', resp: null });
                } else {
                    next();
                }
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _checkUser(req, res, next) {
        if (req.user.id != req.device.userId)
            res.json(404, { code: 404, message: 'Invalid device.', resp: null });
        else
            next();
    }

    _deleteDevice(req, res, next) {
        repo.delete(req.device)
            .then((response) => {
                res.json(200, { code: 200, message: 'Device deleted.', resp: null });
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    _updateDevice(req, res, next) {
        req.device.deviceId = req.body.deviceId;
        req.device.deviceAudit = {
            createdBy: req.device.deviceAudit.createdBy,
            createdOn: req.device.deviceAudit.createdOn,
            createdFrom: req.device.createdFrom.createdBy /* This should be added to the token */,
            modifiedBy: req.user.id,
            modifiedOn: new Date(),
            modifiedFrom: 'MOBILE' /* This should be added to the token */
        }
        repo.update(req.device)
            .then((response) => {
                res.json(200, { code: 200, message: 'Device updated.', resp: null });
            }, (cause) => {
                res.json(400, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(500, { code: error.code, message: error.message, resp: null });
            });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = DeviceRegistrationRoutes;