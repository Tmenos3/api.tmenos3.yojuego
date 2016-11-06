var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var User = require('../models/User');

var userRepo = null;
var jwt = null;

class LogInRoutes {
    constructor(esClient, jwtParam) {
        this._addAllRoutes = this._addAllRoutes.bind(this);
        this._validateRequest = this._validateRequest.bind(this);
        this._validateLogin = this._validateLogin.bind(this);
        this._generateToken = this._generateToken.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(LogInRoutes.INVALID_ES_CLIENT));
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(LogInRoutes.INVALID_JWT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
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
            this._validateRequest,
            this._validateLogin,
            this._generateToken,
            (req, res, next) => {
                res.json(200, { token: req.token, userid: req.body.email });
            });
    }

    _validateRequest(req, res, next) {
        if (req.body == null || req.body == undefined) {
            res.json(400, { code: 400, message: 'Body must be defined.', resp: null });
        } else {
            next();
        }
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
        next();
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