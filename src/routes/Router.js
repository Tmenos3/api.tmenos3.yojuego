let FriendshipRoutes = require('./FriendshipRoutes');
let GroupRoutes = require('./GroupRoutes');
let LogInRoutes = require('./LogInRoutes');
let LogOutRoutes = require('./LogOutRoutes');
let MatchRoutes = require('./MatchRoutes');
let PlayerRoutes = require('./PlayerRoutes');
let SignUpRoutes = require('./SignUpRoutes');
let AuthRoutes = require('./AuthRoutes');
let ResetPasswordRoutes = require('./ResetPasswordRoutes');
let UserRoute = require('./UserRoute');
let ClubRoutes = require('./ClubRoutes');
let FriendshipRequestRoutes = require('./FriendshipRequestRoutes');

class Router {
    constructor() { }

    addAll(server, passport, esClient, jwt, notificationService) {
        new FriendshipRoutes().add(server);
        new GroupRoutes(esClient).add(server);
        new LogInRoutes(esClient, jwt).add(server);
        new LogOutRoutes(esClient).add(server);
        new ClubRoutes(esClient).add(server);
        new MatchRoutes(esClient, notificationService).add(server);
        new PlayerRoutes(esClient).add(server);
        new SignUpRoutes(esClient, jwt).add(server);
        new AuthRoutes(esClient, jwt).add(server, passport);
        new ResetPasswordRoutes(esClient, jwt).add(server);
        new UserRoute(esClient).add(server);
        new FriendshipRequestRoutes(esClient).add(server);
    }
}

module.exports = Router;