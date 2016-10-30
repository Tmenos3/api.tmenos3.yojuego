var InvitationRoutes = require('./InvitationRoutes');
var LogInRoutes = require('./LogInRoutes');
var MatchRoutes = require('./MatchRoutes');
var PlayerRoutes = require('./PlayerRoutes');
var SignUpRoutes = require('./SignUpRoutes');
var AuthRoutes = require('./AuthRoutes');
var ResetPasswordRoutes = require('./ResetPasswordRoutes');
var UserRoute = require('./UserRoute');

class Router {
    constructor() { }

    addAll(server, passport, esClient, jwt) {
        new InvitationRoutes(esClient).add(server);
        new LogInRoutes(esClient, jwt).add(server);
        new MatchRoutes(esClient).add(server);
        new PlayerRoutes(esClient).add(server);
        new SignUpRoutes(esClient, jwt).add(server);
        new AuthRoutes(esClient, jwt).add(server, passport);
        new ResetPasswordRoutes(esClient, jwt).add(server);
        new UserRoute(esClient).add(server);
    }
}

module.exports = Router;