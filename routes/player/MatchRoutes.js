var jwt = require('jsonwebtoken');
var ApiService = require('./src/services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap, jwt);

module.exports = {
  '/user/:username/player/:idPlayer/matches/upcoming': {
    get: function(req, res, cb) {
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
    }
  },
  '/user/:username/player/:idPlayer/matches/:idMatch': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/matches/create': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/matches/:idMatch/remove': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
};