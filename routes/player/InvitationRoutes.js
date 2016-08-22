module.exports = {
  '/user/:username/player/:idPlayer/invitations/pending': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/invitations/:idInvitation': {
    get: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/invitations/:idInvitation/accept': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
  '/user/:username/player/:idPlayer/invitations/:idInvitation/reject': {
    post: function(req, res, cb) {
      res.json({});
      return cb();
    }
  },
};