module.exports = {
  '/user/:username/player/:idPlayer/groups': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/groups/:idGroup': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/groups/:idGroup/remove': {
    delete: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/groups/create': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/groups/:idGroup/inviteTo/:idFriend': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/groups/:idGroup/joinTo': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
};