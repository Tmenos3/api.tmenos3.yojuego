var FriendRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/friends', function(req, res, next) {
        res.json({});
        return next();
      });

    server.get('/user/:username/player/:idPlayer/friends/:idFriend', function(req, res, next) {
        res.json({});
        return next();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/remove', function(req, res, next) {
        res.json({});
        return next();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/accept', function(req, res, next) {
        res.json({});
        return next();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/invite', function(req, res, next) {
        res.json({});
        return next();
      });
  }
};

module.exports = FriendRoutes;