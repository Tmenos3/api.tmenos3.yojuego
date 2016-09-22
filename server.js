var restify = require('restify');
var jwt = require('restify-jwt');
var config = require('./config');
var Router = require('./src/routes/Router');
var passport = require('passport-restify');
var es = require('elasticsearch');
var setup = require('./src/setup/setup');
var client = new es.Client({
  host: config.database,
  log: 'info'
});

var router = new Router();

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(jwt({ secret: config.secret }).unless({ path: config.pathsWithoutAuthentication }));
server.use(passport.initialize());
passport.serializeUser((player, done) => {
  done(null, player);
});

router.addAll(server, passport);

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
