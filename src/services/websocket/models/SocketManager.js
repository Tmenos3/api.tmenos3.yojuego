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
        pos.push(i)
    });

    if (pos.length) {
      p.forEach((p) => {
        this._clients.splice(p, 1)
      });
    }
  }

  broadcastMessage(message) {
    this._clients
      .filter(c => { return c.isConnected() && c.type === message.type && c.id === message.id })
      .forEach(c => { c.sendMessage(message.data); });
  }
}

module.exports = SocketManager;