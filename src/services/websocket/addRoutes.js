let Message = require('./models/Message');

module.exports = (server, config, socketManager) => {
  server.put('/websocket/message', (req, res, next) => {
    //validate token
    let msg = new Message(req.body.ids, req.body.data);
    socketManager.broadcastMessage(msg);
    res.json(200, { code: 200, message: 'Message sent', resp: null });
  });
}