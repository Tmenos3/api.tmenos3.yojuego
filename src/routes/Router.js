var InvitationRoutes = require('./InvitationRoutes');
var LogInRoutes = require('./LogInRoutes');
var MatchRoutes = require('./MatchRoutes');
var PlayerRoutes = require('./PlayerRoutes');
var SignUpRoutes = require('./SignUpRoutes');

class Router {
    constructor() { }

    addAll(server, passport) {
        new InvitationRoutes().add(server);
        new LogInRoutes().add(server);
        new MatchRoutes().add(server);
        new PlayerRoutes().add(server);
        new SignUpRoutes().add(server, passport);
    }
}

module.exports = Router;