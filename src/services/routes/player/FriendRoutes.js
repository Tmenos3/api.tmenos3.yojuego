module.exports = {
  '/user/:username/player/:idPlayer/friends': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/friends/:idFriend': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/friends/:idFriend/remove': {
    delete: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/friends/:idFriend/accept': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/friends/:idFriend/invite': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
};