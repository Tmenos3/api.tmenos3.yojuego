let ESRepository = require('./ESRepository');
let Device = require('../models/Device');

class DeviceESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._map = this._map.bind(this);
        this._getDocument = this._getDocument.bind(this);
    }

    get(id) {
        return super.get(id, 'notifications', 'device')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Device does not exist', resp: null };
                } else {
                    let device = this._map(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: device };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByUserId(userId) {
        //TEST: not null, not undefined
        //TEST: instance of string both
        return super.getBy(this._getQueryByUserId(userId), 'notifications', 'device')
            .then((objRet) => {
                let devices = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let device = this._map(objRet.resp[i]._id, objRet.resp[i]._source);
                    devices.push(device);
                }

                return { code: 200, message: null, resp: devices };
            }, (error) => { return Promise.reject(error); });
    }

    getByDeviceId(deviceId) {
        //TEST: not null, not undefined
        //TEST: instance of string both
        return super.getBy(this._getQueryByDeviceId(deviceId), 'notifications', 'device')
            .then((objRet) => {
                if (objRet.resp.length < 1)
                    return { code: 404, message: 'No devices were found.', resp: null };

                let device = this._map(objRet.resp[0]._id, objRet.resp[0]._source);
                return { code: 200, message: null, resp: device };
            }, (error) => { return Promise.reject(error); });
    }

    add(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        //TEST: return a device
        return super.add(device, 'notifications', 'device')
            .then((resp) => {
                let newDevice = this._map(resp.resp._id, device);
                return { code: 200, message: DeviceESRepository.DOCUMENT_INSERTED, resp: newDevice };
            }, (error) => { return Promise.reject(error); });
    }

    update(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        if (device instanceof Device) {
            let document = this._getDocument(device);
            return super.update(device._id, document, 'notifications', 'device')
                .then((resp) => {
                    return { code: 200, message: DeviceESRepository.DOCUMENT_UPDATED, resp: device };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: DeviceESRepository.INVALID_DEVICE_INSTANCE, resp: null });
        }
    }

    delete(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        if (device instanceof Device) {
            return super.delete(device._id, 'notifications', 'device');
        } else {
            return Promise.reject({ code: 410, message: DeviceESRepository.INVALID_DEVICE_INSTANCE, resp: null });
        }
    }

    _map(id, source) {
        let device = new Device(source.userid, source.deviceid, source.type);

        device._id = id;
        device.deviceAudit = source.deviceAudit;

        return device;
    }

    _getDocument(device) {
        let document = {
            userid: device.userid,
            deviceid: device.deviceid,
            type: device.type,
            userAudit: {
                createdBy: device.deviceAudit.createdBy,
                createdOn: device.deviceAudit.createdOn,
                createdFrom: device.deviceAudit.createdFrom,
                modifiedBy: device.deviceAudit.modifiedBy,
                modifiedOn: device.deviceAudit.modifiedOn,
                modifiedFrom: device.deviceAudit.modifiedFrom
            }
        };

        return document;
    }

    _getQueryByUserId(userId) {
        return {
            "bool": {
                "filter": [
                    { "term": { "userid": userId } }
                ]
            }
        };
    }

    _getQueryByDeviceId(deviceId) {
        return {
            "bool": {
                "filter": [
                    { "term": { "deviceid": deviceId } }
                ]
            }
        };
    }

    static get INVALID_DEVICE() {
        return "Invalid Device";
    }

    static get INVALID_DEVICE_INSTANCE() {
        return 'This instance is not a Device';
    }
}

module.exports = DeviceESRepository;