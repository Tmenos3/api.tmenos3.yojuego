var restify = require('restify');
//var restifyRoutes = require('restify-routes');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./config');
// var ApiService = require('./src/services/ApiService');
// var UserMap = require('./src/models/mappings/UserMap');
// var PlayerMap = require('./src/models/mappings/PlayerMap');
// var MatchMap = require('./src/models/mappings/MatchMap');
// var apiService = new ApiService(UserMap, PlayerMap, MatchMap, jwt);

//mongoose.connect(config.database);

// function showAllUsersCallback(req, res, next) {
//   var token = req.headers.authorization;

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if(err){
//       res.send(401);
//     }else{
//       console.log('decoded: ' + JSON.stringify(decoded));

//       // mongoRep.getAll('users')
//       // .then((users) => {
//       //   console.log('getAll completed: ' + users);
//       //   res.json(users);
//       // }, (ret) => {
//       //   console.log('getAll completed with errors - ret: ' + ret);
//       //   res.json(ret);
//       // })
//       // .catch((err) => {
//       //   console.log('getAll throw unexpected error - err: ' + err);
//       //   res.json(err);
//       // });
//     }
//   });
// }

/*
200 == legit
404 == what you’re looking for isn’t here
401 == you’re not logged in
500 == something on my side went boom
*/

// function getUserProfileCallback(req, res, next) {
//     apiService.getUserProfile(req)
//     .then((ret) => {
//       console.log('getUserProfile completed - ret: ' + ret); 
//       res.json(ret);
//     }, (ret) => {
//       console.log('getUserProfile completed with errors - ret: ' + ret);  
//       res.json(ret); 
//     })
//     .catch((err) => { 
//       console.log('getUserProfile throw unexpected error - err: ' + err);  
//       res.json(err); 
//     });
// }

// function getUpcomingMatchesCallback(req, res, next) {
//     req.params.datefrom = moment().toISOString();
//     var token = req.headers.authorization;
//     apiService.getUpcomingMatches(req)
//     .then((ret) => {
//       console.log('getUserProfile completed - ret: ' + ret); 
//       res.json(ret);
//     }, (ret) => {
//       console.log('getUserProfile completed with errors - ret: ' + JSON.stringify(ret));  
//       res.json(ret); 
//     })
//     .catch((err) => { 
//       console.log('getUserProfile throw unexpected error - err: ' + err);  
//       res.json(err); 
//     });
// }

var server = restify.createServer();
server.use(restify.bodyParser());
//POST
server.post('/echo', (req, res, next) => { res.send(req.body); }); //echo

//GET
server.get('/users', showAllUsersCallback);//solo para test

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
