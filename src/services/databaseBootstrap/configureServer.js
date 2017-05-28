let verifyClaims = require('./middlewares').verifyClaims;
let addRoutes = require('./addRoutes');
let jwtRestify = require('restify-jwt');
let jwt = require('jsonwebtoken');

module.exports = configureServer = (server, restify, esClient, config) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());
    server.use(jwtRestify({ secret: config.serverConfig.secret }));
    server.use(verifyClaims());

    addRoutes(server, esClient);
}
