var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('config');
var UserESRepository = require('../repositories/UserESRepository');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var FacebookUser = require('../models/FacebookUser');
var GoogleUser = require('../models/GoogleUser');
var Player = require('../models/Player');
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var repoUser = null;
var repoPlayer = null;
var jwt = null;

class AuthRoutes {
    constructor(esClient, jwtParam) {
        this._addAllRoutes = this._addAllRoutes.bind(this);
        this._authFacebook = this._authFacebook.bind(this);
        this._authGoogle = this._authGoogle.bind(this);
        this._createUser = this._createUser.bind(this);
        this._createOrUpdatePLayer = this._createOrUpdatePLayer.bind(this);
        this._generateToken = this._generateToken.bind(this);
        this._configurePassport = this._configurePassport.bind(this);
        this._getNewUser = this._getNewUser.bind(this);
        this._auditUser = this._auditUser.bind(this);
        this._getUserAndPlayer = this._getUserAndPlayer.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(AuthRoutes.INVALID_ES_CLIENT));
        validator.addCondition(new NotNullOrUndefinedCondition(jwtParam).throw(AuthRoutes.INVALID_JWT));
        validator.execute(() => {
            repoUser = new UserESRepository(esClient);
            repoPlayer = new PlayerESRepository(esClient);
            jwt = jwtParam;
        }, (err) => { throw err; });
    }

    add(server, passport) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(AuthRoutes.INVALID_SERVER));
        validator.addCondition(new NotNullOrUndefinedCondition(passport).throw(AuthRoutes.INVALID_PASSPORT));

        validator.execute(() => this._addAllRoutes(server, passport), (err) => { throw err; });
    }

    _addAllRoutes(server, passport) {
        this._configurePassport(server, passport);

        server.get('/auth/info', this._getUserAndPlayer);
        server.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'user_birthday', 'email'] }));
        server.get('/auth/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
        server.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), this._createUser, this._createOrUpdatePLayer, this._generateToken, this._auditUser, (req, res, next) => {
            /*
                            let resp = {
                                token: req.token,
                                user: req.user,
                                player: req.player
                            }
                            res.json(200, resp);
            */
            res.redirect('/auth/success?token=' + req.token, next);
        });
        server.get('/auth/google/callback', passport.authenticate('google', { session: false }), this._createUser, this._createOrUpdatePLayer, this._generateToken, this._auditUser, (req, res, next) => {
            /*
                            let resp = {
                                token: req.token,
                                user: req.user,
                                player: req.player
                            }
                            res.json(200, resp);
            */
            res.redirect('/auth/success?token=' + req.token, next);
        });
    }

    _getUserAndPlayer(req, res, next){
        req.user.lastAccess = undefined;
        req.user.password = undefined;
        req.user.token = undefined;
        req.player.auditInfo = undefined;

        let resp = {
            token: req.token,
            user: req.user,
            player: req.player
        }
        res.json(200, resp);
    }

    _authFacebook(req, token, refreshToken, profile, done) {
        repoUser.getByIdAndType(profile.id, 'facebook')
            .then((response) => {
                if (response.resp) {
                    req.exists = true;
                    req.existingUser = response.resp;
                } else {
                    req.newUser = {
                        id: profile.id,
                        email: profile.emails[0].value,
                        type: 'facebook'
                    };
                }

                req.providerInfo = {
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    nickName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                }

                return done(null, profile);
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

    _authGoogle(req, token, refreshToken, profile, done) {
        repoUser.getByIdAndType(profile.id, 'google')
            .then((result) => {
                if (result.resp) {
                    req.exists = true;
                    req.user = result.resp;
                } else {
                    req.newUser = {
                        id: profile.id,
                        email: profile.emails[0].value,
                        type: 'google'
                    };
                }

                req.providerInfo = {
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    nickName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                }

                return done(null, profile);
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
        if (req.exists) {
            req.isNewUser = false;
            req.user = req.existingUser;
            next();
        } else {
            let newUser = this._getNewUser(req.newUser);
            repoUser.add(newUser)
                .then((resp) => {
                    req.user = resp.resp;
                    req.isNewUser = true;
                    next();
                }, (err) => { res.json(400, err); });
        }
    }

    _createOrUpdatePLayer(req, res, next) {
        repoPlayer.getByUserId(req.user._id)
            .then((ret) => {
                if (ret.resp) {
                    //Si ya existe actualizo la info segun facebook o google
                    let player = ret.resp;
                    player.firstName = req.providerInfo.firstName;
                    player.lastName = req.providerInfo.lastName;
                    player.nickName = req.providerInfo.nickName;
                    player.photo = req.providerInfo.photo;
                    player.email = req.providerInfo.email;
                    player.auditInfo.modifiedBy = 'MOBILE_APP';
                    player.auditInfo.modifiedOn = new Date();
                    player.auditInfo.modifiedFrom = 'MOBILE_APP';

                    return repoPlayer.update(player);
                } else {
                    try {
                        let player = new Player(req.providerInfo.firstName, req.providerInfo.lastName, req.providerInfo.nickName, req.user._id, req.providerInfo.email, req.providerInfo.photo, null);
                        player.auditInfo = {
                            createdBy: 'MOBILE_APP', //We should store deviceId here
                            createdOn: new Date(),
                            createdFrom: 'MOBILE_APP',
                            modifiedBy: null,
                            modifiedOn: null,
                            modifiedFrom: null
                        }

                        return repoPlayer.add(player);
                    } catch (error) {
                        res.json(400, { code: 400, message: error.message, resp: error });
                    }
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .then((resp) => {
                req.player = resp.resp;
                next();
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _generateToken(req, res, next) {
        let claims = {
            id: req.user._id
        };
        req.token = jwt.sign(claims, config.get('serverConfig').secret);
        req.user.logIn(req.token);
        next();
    }

    _auditUser(req, res, next) {
        if (!req.isNewUser) {
            req.user.lastAccess = new Date();
            req.user.auditInfo.modifiedBy = 'MOBILE_APP';
            req.user.auditInfo.modifiedOn = new Date();
            req.user.auditInfo.modifiedFrom = 'MOBILE_APP';
        } else {
            req.user.lastAccess = new Date(),
            req.user.auditInfo = {
                createdBy: 'MOBILE_APP',
                createdOn: new Date(),
                createdFrom: 'MOBILE_APP',
                modifiedBy: null,
                modifiedOn: null,
                modifiedFrom: null
            }
        }

        repoUser.update(req.user)
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

    _configurePassport(server, passport) {
        passport.use('facebook', new FacebookStrategy({
            clientID: config.get('auth').facebook.appId,
            clientSecret: config.get('auth').facebook.appSecret,
            callbackURL: config.get('auth').facebook.callback,
            profileFields: ['id', 'birthday', 'name', 'displayName', 'picture.type(large)', 'email'],
            passReqToCallback: true
        }, this._authFacebook));

        passport.use('google', new GoogleStrategy({
            clientID: config.get('auth').google.appId,
            clientSecret: config.get('auth').google.appSecret,
            callbackURL: config.get('auth').google.callback,
            passReqToCallback: true
        }, this._authGoogle));
    }

    _getNewUser(info) {
        switch (info.type) {
            case 'facebook':
                return new FacebookUser(info.id);
            case 'google':
                return new GoogleUser(info.id);
        }
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
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

module.exports = AuthRoutes;