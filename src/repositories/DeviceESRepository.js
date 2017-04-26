let ESRepository = require('./ESRepository');
let Device = require('../models/Device');

class DeviceESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapDevice = this._mapDevice.bind(this);
        this._getDocument = this._getDocument.bind(this);
        this._getQueryByUserIdDeviceIdAndPlatform = this._getQueryByUserIdDeviceIdAndPlatform.bind(this);
    }

    get(id) {
        return super.get(id, 'yojuego', 'device')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Device does not exist', resp: null };
                } else {
                    let device = this._mapDevice(objRet.resp._id, objRet.resp._source)
                    return { code: 200, message: null, resp: device };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByUserIdDeviceIdAndPlatform(userId, deviceId, platform) {
        //TEST: not null, not undefined
        return super.getBy(this._getQueryByUserIdDeviceIdAndPlatform(userId, deviceId, platform), 'yojuego', 'device')
            .then((objRet) => {
                let devices = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let device = this._mapDevice(objRet.resp[i]._id, objRet.resp[i]._source);
                    devices.push(device);
                }

                return { code: 200, message: null, resp: devices };
            }, (error) => { return Promise.reject(error); });
    }

    add(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        //TEST: return a device
        return super.add(device, 'yojuego', 'device')
            .then((resp) => {
                return this.get(resp.resp._id);
            }, (error) => { return Promise.reject(error); })
    }

    update(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        if (device instanceof Device) {
            let document = {
                deviceId: device.deviceId,
                platform: device.platform,
                userId: device.userId,
                deviceAudit: device.deviceAudit
            };

            return super.update(device._id, document, 'yojuego', 'device')
                .then((resp) => {
                    return this.get(resp.resp._id);
                }, (error) => { return Promise.reject(error); });
        } else {
            return { code: 410, message: DeviceESRepository.INVALID_INSTANCE_DEVICE, resp: null };
        }
    }

    delete(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        if (device instanceof Device) {
            return super.delete(device._id, 'yojuego', 'device');
        } else {
            return { code: 410, message: DeviceESRepository.INVALID_INSTANCE_DEVICE, resp: null };
        }
    }

    _mapDevice(id, source) {
        let device = new Device(source.deviceId, source.platform, source.userId, source.deviceAudit);
        device._id = id;

        return device;
    }

    _getDocument(device) {
        let document = {
            deviceId: device.deviceId,
            platform: device.platform,
            userId: device.userId,
            deviceAudit: {
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

    _getQueryByUserIdDeviceIdAndPlatform(userId, deviceId, platform) {
        return {
            "bool": {
                "filter": [
                    { "term": { "userId": userId } },
                    { "term": { "deviceId": deviceId } },
                    { "term": { "platform": platform } }
                ]
            }
        }
    }

    static get INVALID_DEVICE() {
        return "Invalid Device";
    }

    static get INVALID_INSTANCE_DEVICE() {
        return 'This instance is not a device';
    }
}

module.exports = DeviceESRepository