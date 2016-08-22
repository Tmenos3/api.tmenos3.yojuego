var jwt = require('jsonwebtoken');
var UserMap = require('../../models/mappings/UserMap');
var PlayerMap = require('../../models/mappings/PlayerMap');
var ApiService = require('../../services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap, jwt);

var UserRoutes = {
  setRoutes: function(server){
    server.post('/user/login', function(req, res, cb) {
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

        return cb();
      });

    server.post('/user/signUp', function(req, res, cb) {
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

        return cb();
      });
  }
};

module.exports = UserRoutes;