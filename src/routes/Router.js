let InvitationRoutes = require('./InvitationRoutes');
let FriendshipRoutes = require('./FriendshipRoutes');
let GroupRoutes = require('./GroupRoutes');
let LogInRoutes = require('./LogInRoutes');
let MatchRoutes = require('./MatchRoutes');
let PlayerRoutes = require('./PlayerRoutes');
let SignUpRoutes = require('./SignUpRoutes');
let AuthRoutes = require('./AuthRoutes');
let ResetPasswordRoutes = require('./ResetPasswordRoutes');
let UserRoute = require('./UserRoute');
let ServerRoute = require('./ServerRoute');
let ClubRoutes = require('./ClubRoutes');
let DeviceRegistrationRoutes = require('./DeviceRegistrationRoutes');
let NotificationsRoutes = require('../NotificationService/routes/NotificationsRoutes');

class Router {
    constructor() { }

    addAll(server, passport, esClient, jwt) {
        new DeviceRegistrationRoutes(esClient).add(server);
        new InvitationRoutes(esClient).add(server);
        new FriendshipRoutes(esClient).add(server);
        new GroupRoutes(esClient).add(server);
        new LogInRoutes(esClient, jwt).add(server);
        new ClubRoutes(esClient).add(server);
        new MatchRoutes(esClient).add(server);
        new PlayerRoutes(esClient).add(server);
        new SignUpRoutes(esClient, jwt).add(server);
        new AuthRoutes(esClient, jwt).add(server, passport);
        new ResetPasswordRoutes(esClient, jwt).add(server);
        new UserRoute(esClient).add(server);
        new ServerRoute(esClient, jwt).add(server);
        new NotificationsRoutes(esClient).add(server);
    }
}

module.exports = Router;