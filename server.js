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
passport.serializeUser((player, done) => {
  done(null, player);
});


router.addAll(server, passport);

server.get('/echo', (req, res, next) => {
  // client.indices.create({ index: 'yojuego' }, (err, resp, respcode) => {
  //   if (!err) {
  //     client.indices.putMapping({
  //       index: 'app',
  //       type: "player",
  //       body: {
  //         properties: {
  //           nickName: { type: "string" },
  //           birthDate: { type: "string" },
  //           state: { type: "string" },
  //           adminState: { type: "string" },
  //           account: {
  //             type: "nested",
  //             properties: {
  //               id: { type: "string" },
  //               type: { type: "string" },
  //               password: { type: "string" }
  //             }
  //           }
  //         }
  //       }
  //     }, (err, resp, respcode) => {
  //       res.json(200, resp);
  //     });
  //   }
  // });
  client.search({
    index: 'yojuego',
    type: 'player',
    body: {
      query: {
        match: {
          state: 'wooooooow'
        }
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
