var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var config = require('../../config');
var UserESRepository = require('../repositories/UserESRepository');
var FacebookUser = require('../models/FacebookUser');
var GoogleUser = require('../models/GoogleUser');
var jwt = require('jsonwebtoken');
var es = require('elasticsearch');
var FacebookStrategy = require('passport-facebook').Strategy
var LocalStrategy = require('passport-local').Strategy
var client = new es.Client({
    host: config.database,
    log: 'info'
});

var getNewUser = (info) => {
    switch (info.type) {
        case 'facebook':
            return new FacebookUser(info.id);
        case 'google':
            return new GoogleUser(info.id);
    }
}
var repo = new UserESRepository(client);

class AuthRoutes {
    constructor() { }

    add(server, passport) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(server).throw(AuthRoutes.INVALID_SERVER));
        validator.addCondition(new NotNullOrUndefinedCondition(passport).throw(AuthRoutes.INVALID_PASSPORT));

        validator.execute(() => this._addAllRoutes(server, passport), (err) => { throw err; });
    }

    _addAllRoutes(server, passport) {
        this._configurePassport(server, passport);

        server.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), this._createUser, this._generateToken, (req, res, next) => {
            res.redirect('/auth/facebook/success/token=' + req.token, next + '?userid=' + req.user.id);
        });
        server.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => { });
        server.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: ['public_profile', 'user_birthday', 'email'] }));
        server.get('/auth/google', (req, res, next) => { });
    }

    _authFacebook(req, token, refreshToken, profile, done) {
        repo.getByIdAndType(profile.id, 'facebook')
            .then((response) => {
                if (response.resp) {
                    req.exists = true;
                    req.user = response.resp;
                } else {
                    req.newUser = {
                        id: profile.id,
                        type: 'facebook'
                    };
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
            next();
        } else {
            let newUser = getNewUser(req.newUser);
            repo.add(newUser)
                .then((resp) => {
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
        passport.use('facebook', new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.callback,
            profileFields: ['id', 'birthday', 'displayName', 'picture.type(large)', 'email'],
            passReqToCallback: true
        }, this._authFacebook));
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
    }

    static get INVALID_SERVER() {
        return 'El server no puede ser null ni undefined';
    }
}

module.exports = AuthRoutes;