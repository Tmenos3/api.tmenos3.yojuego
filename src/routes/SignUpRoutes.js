var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
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

class SignUpRoutes extends Routes {
    constructor() {
        super();
    }

    add(server, passport) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(Routes.INVALID_SERVER));
        validator.addCondition(new NotNullOrUndefinedCondition(passport).throw(SignUpRoutes.INVALID_PASSPORT));

        validator.execute(() => this._addAllRoutes(server, passport), (err) => { throw err; });
    }

    _addAllRoutes(server, passport) {
        this._configurePassport(server, passport);

        server.get('/signup/facebook/callback', passport.authenticate('facebook', { session: false }), this._createPlayer, (req, res, next) => {
            res.redirect('/signup/facebook/success/token=' + req.token, next);
        });
        server.get('/signup/google/callback', passport.authenticate('google'), (req, res, next) => { });
        server.get('/signup/yojuego', passport.authenticate('yojuego'), this._createPlayer, this._generateToken, (req, res, next) => { res.json(200, { token: req.token }); });
        server.get('/signup/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email'] }));
        server.get('/signup/google', (req, res, next) => { });
    }

    _signUpLocal(req, email, password, done) {
        repo.getBy({ 'account.type': 'yojuego', 'account.id': email })
            .then((result) => {
                let existe = false;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.id == email) {
                        existe = true;
                    }
                }

                // //if (result.length > 0) {
                if (existe) {
                    req.statusCode = 400;
                    req.statusMessage = 'La cuenta está en uso';
                    return done({ code: 400, message: 'La cuenta está en uso' }, null);
                } else {
                    var newPlayer = {
                        account: {
                            type: 'yojuego',
                            id: email,
                            password: password 
                        },
                        nickName: req.params.nickName,
                        birthDate: req.params.birthDate,
                        state: req.params.state,
                        adminState: req.params.adminState
                    };
                    req.newPlayer = newPlayer;
                    return done(null, newPlayer);
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

    _signUpFacebook(req, token, refreshToken, profile, done)  {
        repo.getBy({ 'account.type': 'facebook', 'account.id': profile.id })
            .then((result) => {
                let existe = false;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.type == 'facebook' && result[i].account.id == profile.id) {
                        existe = true;
                    }
                }

                // //if (result.length > 0) {
                if (existe) {
                    req.statusCode = 400;
                    req.statusMessage = 'La cuenta está en uso';
                    return done({ code: 400, message: 'La cuenta está en uso' }, null);
                } else {
                    //aca hay que ver como me devuelve facebook esta info y sale con fritas
                    var newPlayer = {
                        account: {
                            type: 'facebook',
                            id: profile.id 
                        },
                        nickName: 'profile.nickName',
                        birthDate: '1987-03-13T13:15:30Z', //profile.birthDate,
                        state: 'profile.state',
                        adminState: 'profile.adminState'
                    };
                    req.newPlayer = newPlayer;
                    return done(null, profile);
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

    _createPlayer(req, res, next) {
        if (req.statusCode !== undefined && req.statusCode !== null) {
            res.json(req.statusCode, req.statusMessage);
        } else {
            var newPlayer = new Player(req.newPlayer.nickName, new Date(req.newPlayer.birthDate), req.newPlayer.state, req.newPlayer.adminState);
            newPlayer.account = req.newPlayer.account;

            repo.add(newPlayer)
                .then((resp) => {
                    newPlayer.id = resp.resp._id
                    req.player = newPlayer;
                    next();
                }, (err) => { res.json(400, err); });
        }
    }

    _generateToken(req, res, next) {
        req.token = jwt.sign(req.player.id, config.secret);
        next();
    }

    _configurePassport(server, passport) {
        // passport.use('facebook', new FacebookStrategy({
        //     clientID: config.facebook.appId,
        //     clientSecret: config.facebook.appSecret,
        //     callbackURL: config.facebook.callback
        // }, (token, refreshToken, profile, done) => {
        //     return done(null, profile);
        // }));
        passport.use('facebook', new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.callback,
            passReqToCallback: true
        }, this._signUpFacebook));

        passport.use('yojuego', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, this._signUpLocal));

        passport.serializeUser((player, done) => {
            done(null, player);
        });
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
    }
}

module.exports = SignUpRoutes;