var restify = require('restify');
var config = require('./config');
var es = require('elasticsearch');

var cli = new es.Client({
  host: 'http://localhost:9200',
  log: 'info'
});

var server = restify.createServer();
server.use(restify.bodyParser());

server.get('/echo', (req, res, next) => {
  cli.search({
    index: 'app',
    type: 'player',
    body: {
      query: {
        match: {
          _id: 'id'
        }
      }
    }
  }, function (error, response, status) {
    if (error) {
      res.json(error);
    }
    else {
      response.hits.hits.forEach(function (hit) {
        console.log(JSON.stringify(hit));
        res.json(hit);
      });
    }
  });
}); //echo

server.get('/echo1', (req, res, next) => {

  cli.search({
    index: 'app',
    type: 'player',
    body: {
      query: {
        match: {_id: 'AVbjkO6ZpN0HqK6A8pD1'}
      }
    }
  }, (error, response, status) => {
    if (error) {
      res.json(400, JSON.stringify(error));
    }
    else {
      res.json(JSON.stringify(response.hits.hits))
    }
  });
});

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
