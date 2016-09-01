var restify = require('restify');
var config = require('./config');
var es = require('elasticsearch');

var cli = new es.Client({  
    host: 'http://localhost:9200',
    log: 'info'
});

var server = restify.createServer();
server.use(restify.bodyParser());

server.get(id, (req, res, next) => { 
  cli.search({  
    index: 'app',
    type: 'player',
    body: {
        query: {
            match: {
                _id: id
            }
        }
    }
  },function (error, response,status) {
      if (error){
        res.json(error);
      }
      else {
        response.hits.hits.forEach(function(hit){
          console.log(JSON.stringify(hit));
          res.json(hit);
        });
      }
  });
}); //echo

server.get('/echo1', (req, res, next) => { 
  cli.create({
    index: 'app',
    type: 'player',
    id: '1',
    body: {
      title: 'Test 1',
      tags: ['y', 'z'],
      published: true,
      published_at: '2013-01-01',
      counter: 1
    }
  }, function (error, response) {
    // ...
  });
});

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
