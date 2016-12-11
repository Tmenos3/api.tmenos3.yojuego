var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var DeviceESRepository = require('../repositories/DeviceESRepository');

var repo = null;

class DeviceRegistrationRoutes extends Routes {
    constructor(esClient) {
        super();

        this._checkDeviceAndPlatform = this._checkDeviceAndPlatform.bind(this);
        this._registerDevice = this._registerDevice.bind(this);
        this._checkIfDeviceExists = this._checkIfDeviceExists.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(DeviceRegistrationRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new DeviceESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/device/register', super._bodyIsNotNull, this._checkDeviceAndPlatform, this._checkIfDeviceExists, this._registerDevice);
    }

    _checkDeviceAndPlatform(req, res, next) {
        try {
            req.device = new Device(req.body.deviceId, req.body.platform, req.body.userId, new Date());
            next();
        } catch (error) {
            req.json(400, { code: 400, message: error.message, resp: null });
        }
    }

    _checkIfDeviceExists(req, res, next) {
        repo.getByUserDevicePlaytform(req.user.id, req.device.deviceId, req.device.platform)
            .then((response) => {
                if (response.resp) {
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
        repo.add(req.device)
            .then((response) => {
                if (response.resp) {
                    res.json(200, { code: 200, message: 'The device has been registered.', resp: null });
                } else {
                    res.json(500, { code: 500, message: 'Unexpedted error while registering device', resp: null });
                }
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