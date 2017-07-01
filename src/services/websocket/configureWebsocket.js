let WebSocketServer = require('websocket').server;
let config = require('config');
let jwt = require('jsonwebtoken');
let Client = require('./models/Client');
let wsServer = null;
let socketManager = null;

let validateToken = (token) => {
  try {
    return jwt.verify(token, config.get('serverConfig').secret);
  } catch (err) {
    return null;
  }
}

let configureWebSocket = (server, socketManager) => {
  wsServer = new WebSocketServer({ httpServer: server });

  wsServer.on('request', function (request) {
    let params = request.resource.split('/');
    let resp = validateToken(params[1]);
    if (resp) {
      let connection = request.accept(null, request.origin);
      let client = new Client(connection, resp.id);
      socketManager.addClient(client);

      connection.on('close', function (connection) {
        socketManager.removeDisconnectedClients()
      });
    }
  });
}

module.exports = configureWebSocket
