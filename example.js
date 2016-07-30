var restify = require('restify');
var paramReceived = null;
var getFirebaseChild = require('./app/js/FirebaseRepository');

function getMessage(req, res, next) {
  var ref = getFirebaseChild('alarms');

  ref.push({
    id: req.params.name,
    description: 'restify',
    hour: 10,
    minute: 10,
  });

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
