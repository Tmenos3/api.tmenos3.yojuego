var restify = require('restify');
var paramReceived = null;
 
function testMondoDB() {
  console.log('2');
  var mongodb = require('mongodb');
  console.log('3');
 
  //We need to work with "MongoClient" interface in order to connect to a mongodb server.
  var MongoClient = mongodb.MongoClient;
  console.log('4');

  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://localhost:27017/yojuego';
  console.log('5');



  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    console.log('6 - err: ' + err);
    if (err) {
      console.log('7 - Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('8 - Connection established to', url);

      var adminRol = {name: 'admin', access: 'full'};
      var moderatorRol = {name: 'moderator', access: 'limited'};
      var userRol = {name: 'user', access: 'none'};
      var superAdminRol = {name: 'super-admin', access: 'full+grants'};

      var user1 = {name: 'modulus admin', age: 42, roles: [adminRol, moderatorRol, userRol]};
      var user2 = {name: 'modulus user', age: 22, roles: [userRol]};
      var user3 = {name: 'modulus super admin', age: 92, roles: [superAdminRol, adminRol, moderatorRol, userRol]};

      var users = db.collection('users');

      users.insert([user1, user2, user3], function (err, result) {
        if (err) {
          console.log('Error inserting users. ', err);
        } else {
          console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
      });

      var roles = db.collection('users');
      roles.find({name: 'modulus user'}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else if (result.length) {
          console.log('Found:', result);
        } else {
          console.log('No document(s) found with defined "find" criteria!');
        }
      });

      //Close connection
      db.close();
    }
    console.log('9');
  });

  console.log('10');
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
