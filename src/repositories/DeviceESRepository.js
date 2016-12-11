var ESRepository = require('./ESRepository');
var Device = require('../models/Device');

class DeviceESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(id) {
        return new Promise((resolve, reject) => {
            super.get(id, 'yojuego', 'device')
                .then((objRet) => {
                    var device = new Device(objRet.resp.source.deviceId, objRet.resp.source.platform, objRet.resp.source.userId, objRet.resp.source.createdOn);
                    device._id = objRet.resp._id;
                    resolve({ code: 200, message: null, resp: device });
                }, reject);
        });
    }

    getByUserDevicePlaytform(userId, deviceId, platform) {
        //TEST: not null, not undefined
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "device",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "userId": userId } },
                                { "term": { "deviceId": deviceId } },
                                { "term": { "platform": platform } },
                                { "term": { "createdOn": createdOn } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    if (response.hits.hits.length < 1) {
                        resolve({ code: 404, message: 'No devices were found.', resp: null });
                    } else {
                        var device = null;

                        for (let i = 0; i < response.hits.hits.length; i++) {
                            device = new Device(response.hits.hits[i]._source.deviceId, response.hits.hits[i]._source.platform, response.hits.hits[i]._source.userId, response.hits.hits[i]._source.createdOn);
                            device._id = response.hits.hits[i]._id;
                            break;
                        }

                        resolve({ code: 200, message: null, resp: device });
                    }
                }
            });
        });
    }

    add(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        //TEST: return a device
        return new Promise((resolve, reject) => {
            super.add(device, 'yojuego', 'device')
                .then((resp) => {
                    var newDevice = new Device(device.deviceId, device.platform, device.userId, device.createdOn);
                    newDevice._id = resp.resp._id;
                    resolve({ code: 200, message: DeviceESRepository.DOCUMENT_INSERTED, resp: newDevice });
                }, reject)
        });
    }

    update(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        return new Promise((resolve, reject) => {
            if (device instanceof Device) {
                let document = {
                    deviceId: device.deviceId,
                    platform: device.platform,
                    userId: device.userId,
                    createdOn: device.createdOn
                };

                super.update(device._id, document, 'yojuego', 'device')
                    .then((resp) => {
                        var device = new Device(resp._source.deviceId, resp._source.platform, resp._source.userId, resp._source.createdOn);
                        device._id = resp._id;
                        resolve({ code: 200, message: DeviceESRepository.DOCUMENT_UPDATED, resp: device });
                    }, reject);
            } else {
                reject({ code: 410, message: DeviceESRepository.INVALID_INSTANCE_DEVICE, resp: null });
            }
        });
    }

    delete(device) {
        //TEST: not null, not undefined
        //TEST: instance of Device
        return new Promise((resolve, reject) => {
            if (device instanceof Device) {
                super.delete(device._id, 'yojuego', 'device').then(resolve, reject);
            } else {
                reject({ code: 410, message: DeviceESRepository.INVALID_INSTANCE_DEVICE, resp: null });
            }
        });
    }

    static get INVALID_DEVICE() {
        return "Invalid Device";
    }

    static get INVALID_INSTANCE_DEVICE() {
        return 'This instance is not a device';
    }
}

module.exports = DeviceESRepository