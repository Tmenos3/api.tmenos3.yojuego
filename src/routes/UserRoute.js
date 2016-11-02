var Routes = require('./Routes');
var config = require('config');
var User = require('../models/User');
var UserESRepository = require('../repositories/UserESRepository');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var userRepo = null;


class UserRoute extends Routes {
    constructor(esClient) {
        super();
        var validator = new Validator();
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

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = UserRoute;
