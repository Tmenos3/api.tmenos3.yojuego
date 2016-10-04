var jwt = require('restify-jwt');
var config = require('config');
var passport = require('passport-restify');
var Router = require('./routes/Router');
var router = new Router();

var configureServer = (server, restify) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(jwt({ secret: config.serverConfig.secret }).unless({ path: config.serverConfig.pathsWithoutAuthentication }));
    server.use(passport.initialize());

    passport.serializeUser((player, done) => {
        done(null, player);
    });

    router.addAll(server, passport);
}

module.exports = configureServer;
