class Client {
  constructor(connection, params) {
    this._connection = connection;
    this.params = params;
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