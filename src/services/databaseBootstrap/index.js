var configureServer = require('./configureServer');

module.exports = (restify, config, esClient) => {
  var server = restify.createServer({ name: "databaseBootstrap" });

  configureServer(server, restify, esClient);

  server.listen(config.serverConfig.ports["databaseBootstrap"], function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}