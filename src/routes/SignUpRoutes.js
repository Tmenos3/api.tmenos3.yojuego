var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('../../config');
var UserESRepository = require('../repositories/UserESRepository');
var YoJuegoUser = require('../models/YoJuegoUser');
var jwt = require('jsonwebtoken');
var es = require('elasticsearch');
var LocalStrategy = require('passport-local').Strategy
var client = new es.Client({
    host: config.database,
    log: 'info'
});

var repo = new UserESRepository(client);

class SignUpRoutes {
    constructor() { }

    add(server, passport) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(SignUpRoutes.INVALID_SERVER));
        validator.addCondition(new NotNullOrUndefinedCondition(passport).throw(SignUpRoutes.INVALID_PASSPORT));

        validator.execute(() => this._addAllRoutes(server, passport), (err) => { throw err; });
    }

    _addAllRoutes(server, passport) {
        this._configurePassport(server, passport);
        server.get('/signup/yojuego', passport.authenticate('yojuego-signup'), this._createUser, this._generateToken, (req, res, next) => { res.json(200, { token: req.token, userid: req.user.id }); });
    }

    _signUpYoJuego(req, email, password, done) {
        repo.getByIdAndType(email, 'yojuego')
            .then((response) => {
                if (response.resp) {
                    req.statusCode = 400;
                    req.statusMessage = 'La cuenta está en uso';
                    return done({ code: 400, message: 'La cuenta está en uso' }, null);
                } else {
                    var newUser = {
                        type: 'yojuego',
                        id: email,
                        password: password
                    };
                    req.newUser = newUser;
                    return done(null, newUser);
                }
            }, (err) => {
                req.statusCode = 400;
                req.statusMessage = err;
                return done({ code: 400, message: err }, null);
            })
            .catch((err) => {
                req.statusCode = 400;
                req.statusMessage = err;
                return done({ code: 500, message: err }, null);
            });
    }

    _createUser(req, res, next) {
        if (req.statusCode !== undefined && req.statusCode !== null) {
            res.json(req.statusCode, req.statusMessage);
        } else {
            let newUser = new YoJuegoUser(req.newUser.id, req.newUser.password);
            repo.add(newUser)
                .then((response) => {
                    req.user = newUser;
                    next();
                }, (err) => { res.json(400, err); });
        }
    }

    _generateToken(req, res, next) {
        req.token = jwt.sign(req.user.id, config.secret);
        next();
    }

    _configurePassport(server, passport) {
        passport.use('yojuego-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, this._signUpYoJuego));
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
    }

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined';
    }
}

module.exports = SignUpRoutes;