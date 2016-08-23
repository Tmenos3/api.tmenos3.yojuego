var moment = require('moment');
var UserMap = require('../../models/mappings/UserMap');
var PlayerMap = require('../../models/mappings/PlayerMap');
var MatchMap = require('../../models/mappings/MatchMap');
var ApiService = require('../../services/ApiService');

var apiService = new ApiService(UserMap, PlayerMap, MatchMap);

var MatchRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/matches/upcoming', function(req, res, cb) {
      /*
       Dudas: 
          1- Que route deberiamos usar?
             A- /user/:username/matches/upcoming
             B- /user/:username/player/:idPlayer/matches/upcoming
          2- Si utilizo la opcion B, cuando devuelvo el idPlayer? En el logIn?
      */

        req.params.datefrom = moment().toISOString();

        apiService.getUpcomingMatches(req)
        .then((ret) => {
          res.json(ret);
        }, (ret) => {
          res.json(ret); 
        })
        .catch((err) => { 
          res.json(err); 
        });
        return cb();
      });

    server.get('/user/:username/matches/:idMatch', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/matches/:idMatch/remove', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/matches/create', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = MatchRoutes;