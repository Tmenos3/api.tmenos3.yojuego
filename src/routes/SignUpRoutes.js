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

        server.get('/signup/facebook/callback', passport.authenticate('facebook', { session: false }), this._signUpFacebook, this._createPlayer, (req, res, next) => {
            res.redirect('/signup/facebook/success/id=' + req.user.id, next);
        });
        server.get('/signup/google/callback', passport.authenticate('google'), (req, res, next) => {
            res.json(req.user);
        });
        server.get('/signup/local', passport.authenticate('local'), this._createPlayer, this._generateToken);
        server.get('/signup/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email'] }));
        server.get('/signup/google', (req, res, next) => { });
    }

    _signUpLocal(req, email, password, done) {
        repo.getBy({ "account.mail": email })
            .then((result) => {
                let existe = false;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.mail == email) {
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
                        mail: email,
                        password: password,
                        nickName: req.params.nickName,
                        birthDate: req.params.birthDate,
                        state: req.params.state,
                        adminState: req.params.adminState
                    };

                    return done(null, newPlayer);
                }
            }, (err) => { return done({ code: 400, message: err }, null); })
            .catch((err) => {
                return done({ code: 500, message: err }, null);
            });
    }

    _signUpFacebook(req, res, next)  {
        repo.getBy({ "account.mail": email })
            .then((result) => {
                let existe = false;
                //Esta basura la estoy haciendo porque no me funca el filtro
                //lo tengo que solucionar
                for (let i = 0; i < result.length; i++) {
                    if (result[i].account.mail == email) {
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
                        mail: email,
                        password: password,
                        nickName: req.params.nickName,
                        birthDate: req.params.birthDate,
                        state: req.params.state,
                        adminState: req.params.adminState
                    };

                    return done(null, newPlayer);
                }
            }, (err) => { return done({ code: 400, message: err }, null); })
            .catch((err) => {
                return done({ code: 500, message: err }, null);
            });
    }

    _createPlayer(req, res, next) {
        if (req.statusCode !== undefined && req.statusCode !== null) {
            res.json(req.statusCode, req.statusMessage);
        } else {
            var newPlayer = new Player(req.params.nickName, new Date(req.params.birthDate), req.params.state, req.params.adminState);
            newPlayer.account = {
                type: 'local',
                mail: req.params.email,
                password: req.params.password
            };

            repo.add(newPlayer)
                .then((resp) => {
                    newPlayer.id = resp.resp._id
                    req.player = newPlayer;
                    next();
                }, (err) => { res.json(400, err); });
        }
    }

    // _createPlayerFacebook(req, res, next) {
    //     if (req.statusCode !== undefined && req.statusCode !== null) {
    //         res.json(req.statusCode, req.statusMessage);
    //     } else {
    //         var newPlayer = new Player(req.user.displayName, new Date(req.params.birthDate), req.params.state, req.params.adminState);
    //         newPlayer.account = {
    //             type: 'local',
    //             mail: req.params.email,
    //             password: req.params.password
    //         };

    //         repo.add(newPlayer)
    //             .then((resp) => {
    //                 newPlayer.id = resp.resp._id
    //                 req.player = newPlayer;
    //                 next();
    //             }, (err) => { res.json(400, err); });
    //     }
    // }

    _generateToken(req, res, next) {
        var token = jwt.sign(req.player.id, config.secret);
        res.json(200, { token: token, player: req.player });
        next();
    }

    _configurePassport(server, passport) {
        passport.use('facebook', new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.callback,
        }, (token, refreshToken, profile, done) => {
            return done(null, profile);
        }));

        passport.use('local', new LocalStrategy({
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