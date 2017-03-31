let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let config = require('config');
let UserESRepository = require('../repositories/UserESRepository');
let PlayerESRepository = require('../repositories/PlayerESRepository');
let User = require('../models/User');
let Routes = require('./Routes');

let userRepo = null;
let playerRepo = null;
let jwt = null;

class LogInRoutes extends Routes {
    constructor(esClient, jwtParam) {
        super();

        this._addAllRoutes = this._addAllRoutes.bind(this);
        this._validateLogin = this._validateLogin.bind(this);
        this._generateToken = this._generateToken.bind(this);
        this._auditUser = this._auditUser.bind(this);
        this._getPlayer = this._getPlayer.bind(this);
        this._getUser = this._getUser.bind(this);
        this._verifyToken = this._verifyToken.bind(this);
        this._sendResponse = this._sendResponse.bind(this);
        this._verifyTokenOwnedByUser = this._verifyTokenOwnedByUser.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(LogInRoutes.INVALID_ES_CLIENT));
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(LogInRoutes.INVALID_JWT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
            playerRepo = new PlayerESRepository(esClient);
            jwt = jwtParam;
        }, (err) => { throw err; });
    }

    add(server) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(LogInRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/login/yojuego',
            super._bodyIsNotNull,
            this._validateLogin,
            this._getPlayer,
            this._generateToken,
            this._auditUser,
            this._sendResponse);

        server.post('/login/renewtoken',
            super._bodyIsNotNull,
            this._verifyToken,
            this._getUser,
            this._verifyTokenOwnedByUser,
            this._getPlayer,
            this._generateToken,
            this._auditUser,
            this._sendResponse);
    }

    _sendResponse(req, res, next) {
        req.user.userAudit = undefined;
        req.user.password = undefined;
        req.user.token = undefined;
        req.player.playerAudit = undefined;

        let resp = {
            token: req.token,
            user: req.user,
            player: req.player
        }
        res.json(200, resp);
    }

    _getPlayer(req, res, next) {
        playerRepo.getByUserId(req.user._id, 'yojuego')
            .then((response) => {
                req.player = response.resp;
                next();
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getUser(req, res, next) {
        userRepo.get(req.user._id, 'yojuego')
            .then((response) => {
                req.user = response.resp;
                next();
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _verifyTokenOwnedByUser(req, res, next) {
        if (req.user.token !== req.body.token)
            res.json(400, { code: 400, message: 'Unauthorized access.', resp: null });
        else
            next();
    }

    _validateLogin(req, res, next) {
        userRepo.getByIdAndType(req.body.email, 'yojuego')
            .then((response) => {
                if (!response.resp) {
                    res.json(400, { code: 400, message: 'Nombre de usuario o contraseña incorrecto', resp: null });
                } else {
                    if (response.resp.password != req.body.password) {
                        res.json(400, { code: 400, message: 'Nombre de usuario o contraseña incorrecto', resp: null });
                    } else {
                        req.user = response.resp;
                        next();
                    }
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _generateToken(req, res, next) {
        let claims = {
            email: req.user.email,
            id: req.user._id
        };
        req.token = jwt.sign(claims, config.get('serverConfig').secret);
        req.user.token = req.token;
        req.user.isLogged = true;
        next();
    }

    _verifyToken(req, res, next) {
        try {
            req.data = jwt.verify(req.body.token, config.get('serverConfig').secret);
            req.user = {
                _id: req.data.id
            };
            next();
        } catch (error) {
            res.json(400, { code: 400, message: 'Unauthorized access.', resp: null });
        }
    }

    _auditUser(req, res, next) {
        req.user.userAudit.lastAccess = new Date();
        req.user.userAudit.modifiedBy = req.body.platform || 'MOBILE_APP'; //We should store deviceId here
        req.user.userAudit.modifiedOn = new Date();
        req.user.userAudit.modifiedFrom = req.body.platform || 'MOBILE_APP';

        userRepo.update(req.user)
            .then((resp) => {
                req.user = resp.resp;
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

    static get INVALID_JWT() {
        return 'El jwt no puede ser null ni undefined';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = LogInRoutes;