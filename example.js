var restify = require('restify');
var paramReceived = null;
var MongoRepository = require('./src/repositories/MongoRepository');
 
function testMondoDB() {
  var url = 'mongodb://localhost:27017/yojuego';
  var repo = new MongoRepository(url);
  repo.connect()
  .then(() => {
                console.log('resolve connect');
                var user = {name: 'facundo', surname:'la rocca'};
                repo.insert('user', user)
                .then(() => console.log('resolve insert'), (e) => console.log('reject catch: ' + e))
                .catch((e) => console.log('reject insert err: ' + e));

              }, 
        (e) => console.log('reject err: ' + e))
  .catch((e) => console.log('catch err: ' + e));

}

function getMessage(req, res, next) {
  console.log('1');
  testMondoDB();
  console.log('11');

  if(paramReceived === null){
    res.send('Params has not been setted yet');
  }
  else{
      res.send(paramReceived);
  }

  console.log('GET: %s', req.params.name);
  next();
}

function postMessage(req, res, next) {
  console.log('POST req.params.param1: %s', req.params.param1);
  console.log('POST req.params.param2: %s', req.params.param2);

  paramReceived = {
    param1: req.params.param1,
    param2: req.params.param2,
  };

  res.send(201, Math.random().toString(36).substr(3, 8));
  return next();
}

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();

server.use(restify.bodyParser());

server.get('/hello/:name', getMessage);
server.head('/hello/:name', respond);
server.post('/hello', postMessage);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
