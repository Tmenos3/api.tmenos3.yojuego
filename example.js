var restify = require('restify');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var jwtRestify = require('restify-jwt');
var config = require('./config');
var User = require('./src/models/User');

mongoose.connect(config.database);

function signonCallback(req, res, next) {
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

  // var token = req.headers.authorization;

  // jwt.verify(token, config.secret, (err, decoded) => {
  //   if(err){
  //     res.send(401);
  //   }else{
  //     console.log('decodeds: ' + decoded);
  //     User.find({id: decoded._id}, function(err, users) {
  //       res.json(users);
  //     });
  //   }
  // });
    User.find({}, function(err, users) {
      res.json(users);
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
server.use(jwtRestify({
  secret: config.secret,
  credentialsRequired: false
}).unless({path: ['/', '/login', '/signon']}));

server.post('/login', loginCallback);
server.post('/signon', signonCallback);
server.get('/users', showAllUsers);  

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

