var InvitationRoutes = {
  setRoutes: function(server){
    server.get('/user/:username/player/:idPlayer/invitations/pending', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.get('/user/:username/player/:idPlayer/invitations/:idInvitation', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.delete('/user/:username/player/:idPlayer/invitations/:idInvitation/remove', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/invitations/:idInvitation/accept', function(req, res, cb) {
        res.json({});
        return cb();
      });

    server.post('/user/:username/player/:idPlayer/invitations/:idInvitation/reject', function(req, res, cb) {
        res.json({});
        return cb();
      });
  }
};

module.exports = InvitationRoutes;