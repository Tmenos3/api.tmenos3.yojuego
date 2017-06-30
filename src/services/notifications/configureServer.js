let verifyClaims = require('./middlewares').verifyClaims;
let ServiceRoutes = require('./ServiceRoutes');
// let jwtRestify = require('restify-jwt');
// let jwt = require('jsonwebtoken');

module.exports = configureServer = (server, restify, deviceRepository, notificationService) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    // server.use(jwtRestify({ secret: config.serverConfig.secret }));
    server.use(verifyClaims());

    new ServiceRoutes(deviceRepository, notificationService).add(server);
}
