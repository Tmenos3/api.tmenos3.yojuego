let addRoutes = require('./addRoutes');

module.exports = configureServer = (server, restify, esClient) => {
    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    addRoutes(server, esClient);
}
