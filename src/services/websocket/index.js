let configureServer = require('./configureServer');
let configureWebSocket = require('./configureWebSocket');
let SocketManager = require('./models/SocketManager');
let socketManager = new SocketManager();

module.exports = (restify, config, esClient) => {
  let server = restify.createServer({ name: "websocket" });

  configureServer(server, restify, esClient, config, socketManager);

  server.listen(config.serverConfig.ports[server.name], function () {
    console.log('%s listening at %s', server.name, server.url);
  });

  configureWebSocket(server, socketManager)
}
