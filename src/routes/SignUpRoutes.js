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
console.log('PlayerESRepository: ' + JSON.stringify(PlayerESRepository));
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

        server.get('/signUp/facebook/callback', (req, res, next) => { });
        server.get('/signUp/google/callback', passport.authenticate('facebook'), (req, res, next) => {
            res.json(req.user);
        });
        server.post('/signUp/local', passport.authenticate('local'), this._createPlayerLocal, this._generateToken);
        server.post('/signUp/facebook', passport.authenticate('facebook', { display: null, scope: ['email'] }));
        server.post('/signUp/google', (req, res, next) => { });
    }

    _signUpLocal(req, email, password, done) {
        //TEST: It must search by email into repo and return 400 if exist
        //TEST: It must search by mail into repo and execute done if does not exist
        //TEST: what happend if repo returns error?
        //TEST:  what happend if some error is raised?
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

                    return done(null, newPlayer)
                }
            }, (err) => { return done({ code: 400, message: err }, null); })
            .catch((err) => {
                return done({ code: 500, message: err }, null);
            });
    }

    _createPlayerLocal(req, res, next) {
        //TEST: If req.statusCode it must execute res.json with message
        //TEST: If !req.statusCode it must add player and execute next
        //TEST: what happend if repo returns error?
        //TEST:  what happend if some error is raised?
        if (req.statusCode !== undefined && req.statusCode !== null) {
            res.json(req.statusCode, req.statusMessage);
        } else {
            //testear
            var newPlayer = this._getNewPlayer(req.params);

            repo.add(newPlayer)
                .then((resp) => {
                    newPlayer.id = resp.resp._id
                    req.player = newPlayer;
                    next();
                }, (err) => { res.json(400, err); });
        }
    }

    _generateToken(req, res, next) {
        //TEST: it must generate token with player.id and execute res.json with token and execute next
        //TEST: what happend if repo returns error?
        //TEST:  what happend if some error is raised?
        //testear
        var token = jwt.sign(req.player.id, config.secret);
        res.json(200, { token: token, player: req.player });
        next();
    }

    _configurePassport(server, passport) {
        passport.use('facebook', new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.callback,
        }, (token, refreshToken, profile, done) => { }));

        passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, this._signUpLocal));

        passport.serializeUser((player, done) => {
            done(null, player);
        });
    }

    _getNewPlayer(params) {
        var newPlayer = new Player(params.nickName, new Date(params.birthDate), params.state, params.adminState);
        newPlayer.account = {
            type: 'local',
            mail: params.email,
            password: params.password
        };

        return newPlayer;
    }

    static get INVALID_PASSPORT() {
        return 'Invalid passport';
    }
}

module.exports = SignUpRoutes;