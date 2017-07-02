let Routes = require('./Routes');
let config = require('config');
let fetch = require('request');
let User = require('../models/User');
let UserESRepository = require('../repositories/UserESRepository');
let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let userRepo = null;

class UserRoute extends Routes {
    constructor(esClient) {
        super();

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(UserRoute.INVALID_ES_CLIENT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/user/validate',
            this._validateRequest,
            this._validateMailFormat,
            this._validateIfUserExists,
            (res, req, next) => {
                res.json(200, { return: req.return });
            });

        server.put('/user/device/:type', this._paramsIsNotNull, this._bodyIsNotNull, this._registerDevice);
        server.post('/user/device/:type', this._paramsIsNotNull, this._bodyIsNotNull, this._updateDevice);
    }

    _validateRequest(req, res, next) {
        if (req.params == null || req.params == undefined) {
            res.json(400, { code: 400, message: 'Body must be defined.', resp: null });
        } else {
            next();
        }
    }

    _validateMailFormat(req, res, next) {
        if (User.isValidMail(req.params.email)) {
            next();
        } else {
            res.json(400, { code: 400, message: 'Invalid eMail format', resp: false });
        }
    }

    _validateIfUserExists(req, res, next) {
        userRepo.getByIdAndType(req.params.email, 'yojuego')
            .then((response) => {
                if (response.resp) {
                    res.json(400, { code: 400, message: 'La cuenta está en uso.', resp: null });
                } else {
                    next();
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _registerDevice(req, res, next) {
        let body = {
            userid: req.user._id,
            deviceid: req.body.deviceid,
            type: req.params.type
        }

        fetch({
            url: 'http://localhost:8093/notification/register',
            method: 'PUT',
            json: body
        },
            (err, reponse, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (reponse.statusCode !== 200) {
                    res.json(reponse.statusCode, { code: reponse.statusCode, message: 'Something went wrong registering device.', resp: null });
                } else {
                    res.json(200, { code: 200, message: 'The device has been registered', resp: null });
                }
            });
    }

    _updateDevice(req, res, next) {
        let body = {
            userid: req.user._id,
            olddeviceid: req.body.olddeviceid,
            newdeviceid: req.body.newdeviceid,
            type: req.params.type
        }

        fetch({
            url: 'http://localhost:8093/notification/update--',
            method: 'PUT',
            json: body
        },
            (err, reponse, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (reponse.statusCode !== 200) {
                    res.json(reponse.statusCode, { code: reponse.statusCode, message: 'Something went wrong updating device.', resp: null });
                } else {
                    res.json(200, { code: 200, message: 'The device has been updated', resp: null });
                }
            });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = UserRoute;
