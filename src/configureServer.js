let jwtRestify = require('restify-jwt');
let jwt = require('jsonwebtoken');
let config = require('config');
let passport = require('passport-restify');
let Router = require('./routes/Router');
let router = new Router();
let getUser = require('./serverMiddlewares/getUser');
let checkUserToken = require('./serverMiddlewares/checkUserToken');
let getPlayerByUserId = require('./serverMiddlewares/getPlayerByUserId');

let configureServer = (server, restify, client, notificationService) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(jwtRestify({ secret: config.serverConfig.secret }).unless({ path: config.serverConfig.pathsWithoutAuthentication }));
    server.use(passport.initialize());
    server.use(getUser(client, config.serverConfig.pathsWithoutAuthentication));
    server.use(checkUserToken(config.serverConfig.pathsWithoutAuthentication));
    server.use(getPlayerByUserId(client, config.serverConfig.pathsWithoutAuthentication.concat(['/player/create', '/logout'])));

    passport.serializeUser((player, done) => {
        done(null, player);
    });

    router.addAll(server, passport, client, jwt, notificationService);
}

module.exports = configureServer;
