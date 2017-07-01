class Client {
  constructor(connection, id) {
    this._connection = connection;
    this.id = id;
  }

  isConnected() {
    return this._connection.state === 'open';
  }

  isClosed() {
    return this._connection.state === 'closed';
  }

  sendMessage(message) {
    this._connection.sendUTF(JSON.stringify(message));
  }
}

module.exports = Client;