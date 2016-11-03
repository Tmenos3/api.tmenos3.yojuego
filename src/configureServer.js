var jwtRestify = require('restify-jwt');
var jwt = require('jsonwebtoken');
var config = require('config');
var passport = require('passport-restify');
var Router = require('./routes/Router');
var router = new Router();
var es = require('elasticsearch');
var client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});

var configureServer = (server, restify) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(jwtRestify({ secret: config.serverConfig.secret }).unless({ path: config.serverConfig.pathsWithoutAuthentication }));
    server.use(passport.initialize());

    passport.serializeUser((player, done) => {
        done(null, player);
    });

    router.addAll(server, passport, client, jwt);
}

module.exports = configureServer;
