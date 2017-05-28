let addRoutes = require('./addRoutes');

module.exports = configureServer = (server, restify, esClient, config) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    addRoutes(server, config);
}
