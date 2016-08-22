module.exports = {
  '/user/:username/player/:idPlayer/profile': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/profile/update': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
};