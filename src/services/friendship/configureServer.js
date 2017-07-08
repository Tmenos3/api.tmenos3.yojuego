let verifyClaims = require('./middlewares').verifyClaims;
let ServiceRoutes = require('./ServiceRoutes');
let jwtRestify = require('restify-jwt');
let getUser = require('../../serverMiddlewares/getUser');
let checkUserToken = require('../../serverMiddlewares/checkUserToken');
let getPlayerByUserId = require('../../serverMiddlewares/getPlayerByUserId');

module.exports = configureServer = (server, restify, config, friendshipManager, esClient) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(jwtRestify({ secret: config.serverConfig.secret }));
    server.use(getUser(esClient, config.serverConfig.pathsWithoutAuthentication));
    server.use(checkUserToken(config.serverConfig.pathsWithoutAuthentication));
    server.use(getPlayerByUserId(esClient, config.serverConfig.pathsWithoutAuthentication.concat(['/player/create', '/logout'])));
    server.use(verifyClaims());

    new ServiceRoutes(friendshipManager).add(server);
}
