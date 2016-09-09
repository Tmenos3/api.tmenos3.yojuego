var restify = require('restify');
var jwt = require('restify-jwt');
var config = require('./config');
var Router = require('./src/routes/Router');
var passport = require('passport-restify');
var es = require('elasticsearch');
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
//server.use(passport.session());
passport.serializeUser((player, done) => {
  done(null, player);
});


router.addAll(server, passport);

server.get('/echo', (req, res, next) => {
  client.search({
    index: 'app',
    type: 'player',

    query: {
      bool: {
        must: [
          { term: { "account.id": 'facundo@facundo' } },
          { term: { "account.type": 'yojuego' } }
        ],
      }
    }

  }, (error, response, status) => {
    if (error) {
      res.json(400, err);
    }
    else {
      res.json(200, response.hits.hits);
    }
  });
});

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
