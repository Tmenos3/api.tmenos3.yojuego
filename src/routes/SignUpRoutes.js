var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var YoJuegoUser = require('../models/YoJuegoUser');
var Player = require('../models/Player');
var jwt = require('jsonwebtoken');
var es = require('elasticsearch');
var LocalStrategy = require('passport-local').Strategy
var client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});
var moment = require('moment');

var userRepo = new UserESRepository(client);
var playerRepo = new PlayerESRepository(client);

class SignUpRoutes {
    constructor() {
        this._createUser = this._createUser.bind(this);
        this._deleteUser = this._deleteUser.bind(this);
        this._createPlayer = this._createPlayer.bind(this);
        this._insertPlayer = this._insertPlayer.bind(this);
        this._validateRequest = this._validateRequest.bind(this);
        this._validateIfUserExists = this._validateIfUserExists.bind(this);
        this._generateToken = this._generateToken.bind(this);
    }

    add(server) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(SignUpRoutes.INVALID_SERVER));

        validator.execute(() => this._addAllRoutes(server), (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/signup/yojuego',
            this._validateRequest,
            this._validateIfUserExists,
            this._createUser,
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
            if (req.body.email == null || req.body.email == undefined) {
                res.json(400, { code: 400, message: 'EMail must be defined.', resp: null });
            } else {
                if (req.body.password == null || req.body.password == undefined) {
                    res.json(400, { code: 400, message: 'Password must be defined.', resp: null });
                } else {
                    next();
                }
            }
        }
    }

    _validateIfUserExists(req, res, next) {
        userRepo.getByIdAndType(req.body.email, 'yojuego')
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

    _createUser(req, res, next) {
        let newUser = new YoJuegoUser(req.body.email, req.body.password);
        userRepo.add(newUser)
            .then((userResp) => {
                req.user = userResp.resp;
                next();
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
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

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined';
    }
}

module.exports = SignUpRoutes;