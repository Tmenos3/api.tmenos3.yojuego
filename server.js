var restify = require('restify');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var jwtRestify = require('restify-jwt');
var config = require('./config');
var MongoRepository = require('./src/repositories/MongoRepository');
var ApiService = require('./src/services/ApiService');
var mongoRep = new MongoRepository(config.database);
var apiService = new ApiService(mongoRep, jwt);

function showAllUsersCallback(req, res, next) {
  var token = req.headers.authorization;

  jwt.verify(token, config.secret, (err, decoded) => {
    console.log('verify');
    if(err){
      res.send(401);
    }else{
      console.log('decoded: ' + JSON.stringify(decoded));

      mongoRep.getAll('users')
      .then((users) => {
        console.log('getAll completed: ' + users); 
        res.json(users);
      }, (ret) => {
        console.log('getAll completed with errors - ret: ' + ret);  
        res.json(ret); 
      })
      .catch((err) => { 
        console.log('getAll throw unexpected error - err: ' + err);  
        res.json(err); 
      });
    }
  });
  //res.send(req);
}

/*
200 == legit
404 == what you’re looking for isn’t here
401 == you’re not logged in
500 == something on my side went boom
*/

function loginCallback(req, res, next) {
    apiService.login(req)
    .then((ret) => {
      console.log('login completed - ret: ' + ret); 
      res.send(ret);
    }, (ret) => {
      console.log('login completed with errors - ret: ' + ret);  
      res.send(ret); 
    })
    .catch((err) => { 
      console.log('login throw unexpected error - err: ' + err);  
      res.send(err); 
    });
}

function signUpCallback(req, res, next) {
    apiService.signUp(req)
    .then((ret) => {
      console.log('signUp completed - ret: ' + ret); 
      res.send(ret);
    }, (ret) => {
      console.log('signUp completed with errors - ret: ' + ret);  
      res.send(ret); 
    })
    .catch((err) => { 
      console.log('signUp throw unexpected error - err: ' + err);  
      res.send(err); 
    });
}

var server = restify.createServer();
server.use(restify.bodyParser());

//POST
server.post('/login', loginCallback);
server.post('/signUp', signUpCallback);
server.post('/user/invitations/accept', (req, res, next) => { res.send({status: 'notImplemented'})}); //Aceptar uan invitacion recibida
server.post('/user/invitations/reject', (req, res, next) => { res.send({status: 'notImplemented'})}); //Rechazar una invitacion recibida
server.post('/user/friends/accept', (req, res, next) => { res.send({status: 'notImplemented'})}); //Aceptar solicitud de amistad
server.post('/user/friends/invite', (req, res, next) => { res.send({status: 'notImplemented'})}); //Enviar solicitud de amistad
server.post('/user/groups/inviteTo', (req, res, next) => { res.send({status: 'notImplemented'})}); //Invitar a amigos a formar parte del grupo
server.post('/user/groups/joinTo', (req, res, next) => { res.send({status: 'notImplemented'})}); //Unirse a un grupo al que fui invitado
server.post('/user/profile/update', (req, res, next) => { res.send({status: 'notImplemented'})}); //Unirse a un grupo al que fui invitado

//DELETE
server.post('/user/friends/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); //Eliminar un amigo
server.post('/user/matches/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); //Eliminar un partido creado por mi
server.post('/user/invitations/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); //Eliminar una invitacion creada por mi
server.post('/user/groups/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); //Eliminar un grupo creado por mi

//PUT
server.post('/user/matches/create', (req, res, next) => { res.send({status: 'notImplemented'})}); //Crear un partido
server.post('/user/invitations/create', (req, res, next) => { res.send({status: 'notImplemented'})}); //Crear una invitacion
server.post('/user/groups/create', (req, res, next) => { res.send({status: 'notImplemented'})}); //Crear un grupo

//GET
server.get('/users', showAllUsersCallback);//solo para test
server.get('/user/:id/profile', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:id/matches', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:id/invitations', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:id/friends', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:id/groups', (req, res, next) => { res.send({status: 'notImplemented'})});


server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

