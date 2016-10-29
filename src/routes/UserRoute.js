var Routes = require('./Routes');
var config = require('config');
var User = require('../models/User');
var UserESRepository = require('../repositories/UserESRepository');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
//TODO: des instalar esta api
var validator = require('validator');
var userRepo = null;

class UserRoute extends Routes {
    constructor(esClient, jwtParam) {
        super();

        Validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(UserRoute.INVALID_ES_CLIENT));
        Validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(UserRoute.INVALID_JWT));

        Validator.excute(() => {
            userRepo = new UserESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/user/validar',
            this._validateRequest,
            this._validateMailFormat,
            this.validateIfMailIsUsed,
            (res, req, next) => {
                res.json(200, { return: req.return });
            });
    }

    _validateRequest(req, res, next) {
        if (req.body == null || req.body == undefined) {
            res.json(400, { code: 400, message: 'Body must be defined.', resp: null });
        } else {
            next();
        }
    }

    _validateMailFormat(req, res, next) {
        if (User.isValidMail(req.body.email)) {
            next();
        } else {
            res.json(400, { code: 400, message: 'Invalid eMail format', resp: false });
        }
    }

    validateIfMailIsUsed(req, res, next) {

    }

    static get INVALID_JWT() {
        return 'El jwt no puede ser null ni undefined';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }

}

module.exports = UserRoute;
