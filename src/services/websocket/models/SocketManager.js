class SocketManager {
  constructor() {
    this._clients = [];

    this.addClient = this.addClient.bind(this);
    this.removeDisconnectedClients = this.removeDisconnectedClients.bind(this);
    this.broadcastMessage = this.broadcastMessage.bind(this);
  }

  addClient(connection) {
    this._clients.push(connection)
  }

  removeDisconnectedClients() {
    let pos = []
    this._clients.forEach((c) => {
      if (c.isClosed())
        pos.push(c)
    });

    if (pos.length) {
      pos.forEach((p) => {
        this._clients.splice(p, 1)
      });
    }
  }

  broadcastMessage(message) {
    message.ids.forEach(i => {
      this._clients
        .filter(c => { return c.isConnected() && c.id === i })
        .forEach(c => { c.sendMessage(message.data); });
    });
  }
}

module.exports = SocketManager;