var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var YoJuegoUser = require('../models/YoJuegoUser');
var Player = require('../models/Player');
var moment = require('moment');

var userRepo = null;
var playerRepo = null;
var jwt = null;

class SignUpRoutes extends Routes {
    constructor(esClient, jwtParam) {
        super();

        this._createUser = this._createUser.bind(this);
        this._deleteUser = this._deleteUser.bind(this);
        this._createPlayer = this._createPlayer.bind(this);
        this._insertPlayer = this._insertPlayer.bind(this);
        this._validateRequest = this._validateRequest.bind(this);
        this._validateIfUserExists = this._validateIfUserExists.bind(this);
        this._generateToken = this._generateToken.bind(this);
        this._insertUser = this._insertUser.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(SignUpRoutes.INVALID_ES_CLIENT));
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(SignUpRoutes.INVALID_JWT));

        validator.execute(() => {
            userRepo = new UserESRepository(esClient);
            playerRepo = new PlayerESRepository(esClient);
            jwt = jwtParam;
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/signup/yojuego',
            this._validateRequest,
            this._createUser,
            this._validateIfUserExists,
            this._insertUser,
            this._createPlayer,
            this._insertPlayer,
            this._generateToken,
            (req, res, next) => {
                res.json(200, { token: req.token, userid: req.user.id });
            });
    }

    _validateRequest(req, res, next) {
        if (req.body == null || req.body == undefined) {
            res.json(400, { code: 400, message: 'Body must be defined.', resp: null });
        } else {
            next();
        }
    }

    _createUser(req, res, next) {
        try {
            req.newUser = new YoJuegoUser(req.body.email, req.body.password);
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

    _createPlayer(req, res, next) {
        try {
            if (!(moment(req.body.birthDate, "YYYY-MM-DDTHH:mm:ssZ", true).isValid()))
                throw new Error("Invalid birthDate.");

            req.player = new Player(req.body.nickName,
                new Date(req.body.birthDate),
                req.body.state,
                req.body.adminState,
                req.user._id);

            next();
        } catch (error) {
            this._deleteUser(req.user, (err) => {
                if (err) {
                    res.json(500, { code: 500, message: err, resp: null });
                } else {
                    res.json(400, { code: 400, message: error.message, resp: error });
                }
            });
        }
    }

    _insertPlayer(req, res, next) {
        playerRepo.add(req.player)
            .then((playerResp) => {
                next();
            }, (err) => {
                this._deleteUser(req.user, (error) => {
                    if (error) {
                        res.json(500, { code: 500, message: error, resp: null });
                    } else {
                        res.json(400, { code: 400, message: err, resp: null });
                    }
                });
            })
            .catch((err) => {
                this._deleteUser(req.user, (error) => {
                    if (error) {
                        res.json(500, { code: 500, message: error, resp: null });
                    } else {
                        res.json(400, { code: 400, message: err, resp: null });
                    }
                });
            });
    }

    _generateToken(req, res, next) {
        req.token = jwt.sign(req.user.id, config.get('serverConfig').secret);
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

    static get INVALID_JWT() {
        return 'El jwt no puede ser null ni undefined';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = SignUpRoutes;