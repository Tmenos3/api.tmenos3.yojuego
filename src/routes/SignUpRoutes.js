var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var YoJuegoUser = require('../models/YoJuegoUser');

var userRepo = null;
var jwt = null;

class SignUpRoutes extends Routes {
    constructor(esClient, jwtParam) {
        super();

        this._createUser = this._createUser.bind(this);
        this._deleteUser = this._deleteUser.bind(this);
        this._validateIfUserExists = this._validateIfUserExists.bind(this);
        this._generateToken = this._generateToken.bind(this);
        this._insertUser = this._insertUser.bind(this);
        this._auditUser = this._auditUser.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(SignUpRoutes.INVALID_ES_CLIENT));
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(SignUpRoutes.INVALID_JWT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
            jwt = jwtParam;
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/signup/yojuego',
            super._bodyIsNotNull,
            this._createUser,
            this._validateIfUserExists,
            this._insertUser,
            this._generateToken,
            this._auditUser,
            (req, res, next) => {
                let resp = {
                    token: req.token,
                    user: req.user,
                    player: null
                }
                res.json(200, resp);
            });
    }

    _createUser(req, res, next) {
        try {
            req.newUser = new YoJuegoUser(req.body.email, req.body.password, false, null);
            next();
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: null });
        }
    }

    _validateIfUserExists(req, res, next) {
        userRepo.getByIdAndType(req.newUser.id, 'yojuego')
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

    _insertUser(req, res, next) {
        try {
            userRepo.add(req.newUser)
                .then((userResp) => {
                    req.user = userResp.resp;
                    next();
                }, (err) => {
                    res.json(400, { code: 400, message: err, resp: null });
                })
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: null });
        }
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

    _deleteUser(user, doAfterDelete) {
        userRepo.delete(user)
            .then((resp) => {
                doAfterDelete();
            }, (err) => {
                doAfterDelete(err);
            });
    }

    _auditUser(req, res, next) {
        req.user.userAudit = {
            lastAccess: new Date(),
            createdBy: req.body.platform || 'MOBILE_APP',
            createdOn: new Date(),
            createdFrom: req.body.platform || 'MOBILE_APP',
            modifiedBy: null,
            modifiedOn: null,
            modifiedFrom: null
        }

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

    static get INVALID_JWT() {
        return 'El jwt no puede ser null ni undefined';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = SignUpRoutes;