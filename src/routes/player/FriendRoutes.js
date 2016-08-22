var FriendRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/friends', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.get('/user/:username/player/:idPlayer/friends/:idFriend', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/remove', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/accept', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/friends/:idFriend/invite', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = FriendRoutes;