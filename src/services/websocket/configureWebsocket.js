let WebSocketServer = require('websocket').server;
let Client = require('./models/Client');
let Params = require('./models/Params');
let wsServer = null;
let socketManager = null;

let configureWebSocket = (server, socketManager) => {
  wsServer = new WebSocketServer({ httpServer: server });

  wsServer.on('request', function (request) {
    let connection = request.accept(null, request.origin);
    let client = new Client(connection, Params.ParseParams(request.resource));
    socketManager.addClient(client);

    connection.on('close', function (connection) {
      socketManager.removeDisconnectedClients()
    });
  });
}

module.exports = configureWebSocket
