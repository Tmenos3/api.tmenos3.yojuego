var restify = require('restify');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var jwtRestify = require('restify-jwt');
var config = require('./config');
var User = require('./src/models/User');

mongoose.connect(config.database);

function signinCallback(req, res, next) {
  console.log('signon');
  console.log('req.body.username: ' + req.body.username);
  console.log('req.body.password: ' + req.body.password);

  if (req.body === undefined || req.body === null){
    res.json({ err: 'Invalid body' });
  }else if (req.body.username === undefined || req.body.username === null) {
    res.json({ err: 'Body.username is undefined or null.' });
  }else if (req.body.password === undefined || req.body.password === null) {
    res.json({ err: 'Body.password is undefined or null.' });
  }else{
      User.find({username: req.body.username}, function(err, users) {
        if (users.length > 0){
          res.json({ err: 'Username ' + req.body.username + ' is already in use.' });
        }else{
            var newUser = new User({ 
              username: req.body.username, 
              password: req.body.password
            });

            newUser.save(function(err) {
              if (err) throw err;

              console.log('User ' + newUser.username + ' has been created.');
              res.json({ success: true, msj: 'User ' + newUser.username + ' has been created.' });
            });
        }
      });
  }
}

function showAllUsers(req, res, next) {
  console.log('showAllUsers');
  console.log('req.headers: ' + req.headers);
  console.log('req.headers.authorization: ' + req.headers.authorization);

  var token = req.headers.authorization;

  jwt.verify(token, config.secret, (err, decoded) => {
    if(err){
      res.send(401);
    }else{
      console.log('decodeds: ' + decoded);
      User.find({id: decoded._id}, function(err, users) {
        res.json(users);
      });
    }
  });
}

/*
200 == legit
404 == what you’re looking for isn’t here
401 == you’re not logged in
500 == something on my side went boom
*/

function loginCallback(req, res, next) {

  User.find({username: req.body.username}, function(err, users) {
    var user = users[0];
    if (err) {
        console.log('something goes wrong');
        res.send({success: false, err: 'something goes wrong'});
    }else if (!user){
        console.log('user does not exist');
        res.send({success: false, err: 'user does not exist'});
    }else if(user.password != req.body.password){
        console.log('invalid password');
        res.send({success: false, err: 'invalid password'});
    }else {
        var token = jwt.sign({username: user.username, password: user.password}, config.secret, {
          expiresIn: 60 // expires in 24 hours
        }); 
        res.send({success: false, creedentials: {username: user.username, password: user.password, token: token}});
    }
  });
}

var server = restify.createServer();
server.use(restify.bodyParser());
// server.use(jwtRestify({
//   secret: config.secret,
//   credentialsRequired: false
// }).unless({path: ['/', '/login', '/signon']}));

//POST
server.post('/login', loginCallback);
server.post('/signin', signinCallback);
server.post('/user/invitations/accept', (req, res, next) => {}); //Aceptar uan invitacion recibida
server.post('/user/invitations/reject', (req, res, next) => {}); //Rechazar una invitacion recibida
server.post('/user/friends/accept', (req, res, next) => {}); //Aceptar solicitud de amistad
server.post('/user/friends/invite', (req, res, next) => {}); //Enviar solicitud de amistad
server.post('/user/groups/inviteTo', (req, res, next) => {}); //Invitar a amigos a formar parte del grupo
server.post('/user/groups/joinTo', (req, res, next) => {}); //Unirse a un grupo al que fui invitado
server.post('/user/profile/update', (req, res, next) => {}); //Unirse a un grupo al que fui invitado

//DELETE
server.post('/user/friends/remove', (req, res, next) => {}); //Eliminar un amigo
server.post('/user/matches/remove', (req, res, next) => {}); //Eliminar un partido creado por mi
server.post('/user/invitations/remove', (req, res, next) => {}); //Eliminar una invitacion creada por mi
server.post('/user/groups/remove', (req, res, next) => {}); //Eliminar un grupo creado por mi

//PUT
server.post('/user/matches/create', (req, res, next) => {}); //Crear un partido
server.post('/user/invitations/create', (req, res, next) => {}); //Crear una invitacion
server.post('/user/groups/create', (req, res, next) => {}); //Crear un grupo

//GET
server.get('/users', showAllUsers);//solo para test
server.get('/user/profile', (req, res, next) => {});
server.get('/user/matches', (req, res, next) => {});
server.get('/user/invitations', (req, res, next) => {});
server.get('/user/friends', (req, res, next) => {});
server.get('/user/groups', (req, res, next) => {});


server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});

