let configureServer = require('./configureServer');

module.exports = (restify, config, esClient) => {
  let server = restify.createServer({ name: "database" });

  configureServer(server, restify, esClient, config);

  server.listen(config.serverConfig.ports[server.name], function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}