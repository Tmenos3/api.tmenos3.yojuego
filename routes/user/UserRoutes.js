var ApiService = require('./src/services/ApiService');
var apiService = new ApiService(UserMap, PlayerMap, MatchMap, jwt);

module.exports = {
  '/user/login': {
    post: function(req, res, cb) {
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
    }
  },
  '/user/signUp': {
    post: function(req, res, cb) {
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
    }
  }
};