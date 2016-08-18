var restify = require('restify');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var jwtRestify = require('restify-jwt');
var config = require('./config');
var MongoRepository = require('./src/repositories/MongoRepository');
var ApiService = require('./src/services/ApiService');
var mongoRep = new MongoRepository(config.database);
var apiService = new ApiService(mongoRep, jwt);
var moment = require('moment');

function showAllUsersCallback(req, res, next) {
  var token = req.headers.authorization;

  jwt.verify(token, config.secret, (err, decoded) => {
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
      res.json(ret);
    }, (ret) => {
      console.log('login completed with errors - ret: ' + ret);  
      res.json(ret); 
    })
    .catch((err) => { 
      console.log('login throw unexpected error - err: ' + err);  
      res.json(err); 
    });
}

function signUpCallback(req, res, next) {
    apiService.signUp(req)
    .then((ret) => {
      console.log('signUp completed - ret: ' + ret); 
      res.json(ret);
    }, (ret) => {
      console.log('signUp completed with errors - ret: ' + ret);  
      res.json(ret); 
    })
    .catch((err) => { 
      console.log('signUp throw unexpected error - err: ' + err);  
      res.json(err); 
    });
}

function getUserProfileCallback(req, res, next) {
    apiService.getUserProfile(req)
    .then((ret) => {
      console.log('getUserProfile completed - ret: ' + ret); 
      res.json(ret);
    }, (ret) => {
      console.log('getUserProfile completed with errors - ret: ' + ret);  
      res.json(ret); 
    })
    .catch((err) => { 
      console.log('getUserProfile throw unexpected error - err: ' + err);  
      res.json(err); 
    });
}

function getUpcomingMatchesCallback(req, res, next) {
    req.params.datefrom = moment().toISOString();
    var token = req.headers.authorization;
    apiService.getUpcomingMatches(req)
    .then((ret) => {
      console.log('getUserProfile completed - ret: ' + ret); 
      res.json(ret);
    }, (ret) => {
      console.log('getUserProfile completed with errors - ret: ' + JSON.stringify(ret));  
      res.json(ret); 
    })
    .catch((err) => { 
      console.log('getUserProfile throw unexpected error - err: ' + err);  
      res.json(err); 
    });
}

// var User = require('./src/models/mappings/UserMap');
// var Player = require('./src/models/mappings/PlayerMap');
// var Match = require('./src/models/mappings/MatchMap');
// function test(req, res, next) {
//   var mongoose = require('mongoose');
//   var db = mongoose.connect(config.database);

//   var user = new User({ username: 'mongoose', password: 'fucking pass' });
//   user.save((err) => {
//     if (err) {
//       res.json(err);
//     } else {
//       console.log('user saved');
//       var player = new Player({_idUser: user._id});
//       player.save((err) => {
//         if (err){
//           res.json(err);
//         }else{
//           console.log('player saved');
//             var match = new Match({creator: player._id});
//             match.save((err) => {
//               if (err){
//                 res.json(err);
//               }else{
//                 console.log('match saved');

//                 Player.find({_idUser: user._id}).populate('matches._id').populate('_idUser').exec((err, players) => {
//                   db.disconnect();
//                   res.json(players);
//                 });
//               }
//             });
//         }
//       });
//     }
//   });
// }

var server = restify.createServer();
server.use(restify.bodyParser());

//POST
//server.post('/', test);
server.post('/login', loginCallback);
server.post('/signup', signUpCallback);
server.post('/user/invitations/accept', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/invitations/reject', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/friends/accept', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/friends/invite', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/groups/inviteTo', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/groups/joinTo', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/profile/update', (req, res, next) => { res.send({status: 'notImplemented'})});

//DELETE
server.post('/user/friends/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); 
server.post('/user/matches/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); 
server.post('/user/invitations/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); 
server.post('/user/groups/remove', (req, res, next) => { res.send({status: 'notImplemented'})}); 

//PUT
server.post('/user/matches/create', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/invitations/create', (req, res, next) => { res.send({status: 'notImplemented'})});
server.post('/user/groups/create', (req, res, next) => { res.send({status: 'notImplemented'})});

//GET
server.get('/users', showAllUsersCallback);//solo para test
server.get('/user/:username/profile', getUserProfileCallback);
server.get('/user/:username/matches/upcoming', getUpcomingMatchesCallback);
server.get('/user/:username/matches/:idMatch', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/invitations/pending', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/invitations/:idInvitation', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/friends', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/friends/:idFriend', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/groups', (req, res, next) => { res.send({status: 'notImplemented'})});
server.get('/user/:username/groups/:idGroup', (req, res, next) => { res.send({status: 'notImplemented'})});


server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

