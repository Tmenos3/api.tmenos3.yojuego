var config = require('../../../config');
var jwt = require('jsonwebtoken');
var UserMap = require('../../models/mappings/UserMap');
var PlayerMap = require('../../models/mappings/PlayerMap');
var MatchMap = require('../../models/mappings/MatchMap');
var ApiService = require('../../services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap);

var UserRoutes = {
  setRoutes: function(server){
    server.post('/login', function(req, res, cb) {
        apiService.login(req)
        .then((ret) => {
            console.log('login completed - ret: ' + ret); 
            var token = jwt.sign({id: ret.id}, config.secret, { expiresIn: config.expiresIn });
            res.json({status: true, token: token});
            return cb();
        }, (ret) => {
            console.log('login completed with errors - ret: ' + ret);  
            res.json(ret);
            return cb(); 
        })
        .catch((err) => { 
            console.log('login throw unexpected error - err: ' + err);  
            res.json(err);
            return cb(); 
        });
      });

    server.post('/signUp', function(req, res, cb) {
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