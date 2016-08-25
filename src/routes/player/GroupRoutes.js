var GroupRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/groups', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.get('/user/:username/player/:idPlayer/groups/:idGroup', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/groups/:idGroup/remove', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/groups/create', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/groups/:idGroup/inviteTo/:idFriend', function(req, res, cb) {
        res.json({});
        return cb();
      });
    server.post('/user/:username/player/:idPlayer/groups/:idGroup/joinTo', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = GroupRoutes;