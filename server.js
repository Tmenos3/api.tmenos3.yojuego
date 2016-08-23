var restify = require('restify');
var jwt = require('restify-jwt');
var config = require('./config');
var mongoose = require('mongoose');
var FriendRoutes = require('./src/routes/player/FriendRoutes');
var GroupRoutes = require('./src/routes/player/GroupRoutes');
var InvitationRoutes = require('./src/routes/player/InvitationRoutes');
var MatchRoutes = require('./src/routes/player/MatchRoutes');
var PlayerRoutes = require('./src/routes/player/PlayerRoutes');
var UserRoutes = require('./src/routes/user/UserRoutes');

mongoose.connect(config.database);

var server = restify.createServer();
server.use(restify.bodyParser());
server.use(jwt({ secret: config.secret}).unless({path: config.pathsWithoutAuthentication}));


FriendRoutes.setRoutes(server);
GroupRoutes.setRoutes(server);
InvitationRoutes.setRoutes(server);
MatchRoutes.setRoutes(server);
PlayerRoutes.setRoutes(server);
UserRoutes.setRoutes(server);

server.post('/echo', (req, res, next) => { res.send(req.body); }); //echo

server.listen(config.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
