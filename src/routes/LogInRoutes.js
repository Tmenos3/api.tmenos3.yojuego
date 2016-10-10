var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var es = require('elasticsearch');
var LocalStrategy = require('passport-local').Strategy
var client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});

var repo = new UserESRepository(client);

class LogInRoutes {
    constructor() { }

    add(server, passport) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(LogInRoutes.INVALID_SERVER));
        validator.addCondition(new NotNullOrUndefinedCondition(passport).throw(LogInRoutes.INVALID_PASSPORT));

        validator.execute(() => this._addAllRoutes(server, passport), (err) => { throw err; });
    }

    _addAllRoutes(server, passport) {
        this._configurePassport(server, passport);

        server.get('/login/yojuego', passport.authenticate('yojuego-login'), this._generateToken, (req, res, next) => { res.json(200, { token: req.token, userid: req.user.id }); });
    }

    _loginLocal(req, email, password, done) {
        repo.getByIdAndType(email, 'yojuego')
            .then((response) => {
                if (!response.resp) {
                    req.statusCode = 400;
                    req.statusMessage = 'Nombre de usuario o contraseña incorrecto';
                    return done({ code: 400, message: 'Nombre de usuario o contraseña incorrecto' }, null);
                } else {
                    if (response.resp.password != password) {
                        req.statusCode = 400;
                        req.statusMessage = 'Nombre de usuario o contraseña incorrecto';
                        return done({ code: 400, message: 'Nombre de usuario o contraseña incorrecto' }, null);
                    } else {
                        req.user = response.resp;
                        return done(null, response.resp);
                    }
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

    _generateToken(req, res, next) {
        if (req.statusCode !== undefined && req.statusCode !== null) {
            res.json(req.statusCode, req.statusMessage);
        } else {
            req.token = jwt.sign(req.user.id, config.get('serverConfig').secret);
            next();
        }
    }

    _configurePassport(server, passport) {
        passport.use('yojuego-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, this._loginLocal));
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
    }

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined';
    }
}

module.exports = LogInRoutes;