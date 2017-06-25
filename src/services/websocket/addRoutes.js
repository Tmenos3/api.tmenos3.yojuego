let Message = require('./models/Message');

module.exports = (server, config, socketManager) => {
  server.put('/websocket/message/:token/:type/:id', (req, res, next) => {
    //validate token
    let msg = new Message(req.params.type, req.params.id, req.body.message);
    socketManager.broadcastMessage(msg);
    res.json(200, { code: 200, message: 'Message sent', resp: null });
  });
}