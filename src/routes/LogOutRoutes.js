let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let config = require('config');
let UserESRepository = require('../repositories/UserESRepository');
let User = require('../models/User');
let Routes = require('./Routes');

let userRepo = null;

class LogOutRoutes extends Routes {
    constructor(esClient) {
        super();

        this._addAllRoutes = this._addAllRoutes.bind(this);
        this._validateLogin = this._validateLogin.bind(this);
        this._clearToken = this._clearToken.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(LogOutRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
        }, (err) => { throw err; });
    }

    add(server) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(LogOutRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/logout',
            this._validateLogin,
            this._clearToken,
            (req, res, next) => {
                res.json(200, { code: 200, message: 'Logged out.', resp: null });
            });
    }

    _validateLogin(req, res, next) {
        if (!req.user.isLoggedIn()) {
            res.json(400, { code: 400, message: 'El usuario no ha iniciado session.', resp: null });
        } else {
            next();
        }
    }

    _clearToken(req, res, next) {
        req.user.logOut();
        req.user.lastAccess = new Date();
        req.user.auditInfo.modifiedBy = 'MOBILE_APP'; //We should store deviceId here
        req.user.auditInfo.modifiedOn = new Date();
        req.user.auditInfo.modifiedFrom = 'MOBILE_APP';

        userRepo.update(req.user)
            .then((resp) => {
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = LogOutRoutes;