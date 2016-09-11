var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('../../config');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var Player = require('../models/Player');
var jwt = require('jsonwebtoken');
var es = require('elasticsearch');
var FacebookStrategy = require('passport-facebook').Strategy
var LocalStrategy = require('passport-local').Strategy
var client = new es.Client({
    host: config.database,
    log: 'info'
});

var repo = new PlayerESRepository(client);

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

        server.get('/login/facebook/callback', passport.authenticate('facebook-login', { session: false }), this._generateToken, (req, res, next) => {
            res.redirect('/login/facebook/success/token=' + req.token, next);
        });
        server.get('/login/google/callback', passport.authenticate('google-login'), (req, res, next) => { });
        server.get('/login/yojuego', passport.authenticate('yojuego-login'), this._generateToken, (req, res, next) => { res.json(200, { token: req.token }); });
        server.get('/login/facebook', passport.authenticate('facebook-login', { session: false, scope: ['public_profile', 'user_birthday', 'email'] }));
        server.get('/login/google', (req, res, next) => { });
    }

    _loginLocal(req, email, password, done) {
        repo.getBy({ 'account.type': 'yojuego', 'account.id': email })
            .then((result) => {
                let player;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.id == email) {
                        player = result[i];
                    }
                }

                // //if (result.length > 0) {
                if (player === undefined || player === null) {
                    req.statusCode = 400;
                    req.statusMessage = 'Nombre de usuario o contraseña incorrecto';
                    return done({ code: 400, message: 'Nombre de usuario o contraseña incorrecto' }, null);
                } else {
                    req.player = player;
                    return done(null, player);
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

    _loginFacebook(req, token, refreshToken, profile, done) {
        repo.getBy({ 'account.type': 'facebook', 'account.id': profile.id })
            .then((result) => {
                let player;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.type == 'facebook' && result[i].account.id == profile.id) {
                        player = result[i];
                    }
                }

                // //if (result.length > 0) {
                if (player === undefined || player === null) {
                    req.statusCode = 400;
                    req.statusMessage = 'Nombre de usuario o contraseña incorrecto';
                    return done({ code: 400, message: 'Nombre de usuario o contraseña incorrecto' }, null);
                } else {
                    //aca hay que ver como me devuelve facebook esta info y sale con fritas
                    req.player = player;
                    return done(null, player);
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
            req.token = jwt.sign(req.player.id, config.secret);
            next();
        }
    }

    _configurePassport(server, passport) {
        passport.use('facebook-login', new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.callback,
            passReqToCallback: true
        }, this._loginFacebook));

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