var jwt = require('jsonwebtoken');
var UserMap = require('../../models/mappings/UserMap');
var PlayerMap = require('../../models/mappings/PlayerMap');
var ApiService = require('../../services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap, jwt);

var MatchRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/matches/upcoming', function(req, res, cb) {
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
        return cb();
      });

    server.get('/user/:username/player/:idPlayer/matches/:idMatch', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.delete('/user/:username/player/:idPlayer/matches/:idMatch/remove', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/matches/create', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = MatchRoutes;