var PlayerRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/profile', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/profile/update', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = PlayerRoutes;