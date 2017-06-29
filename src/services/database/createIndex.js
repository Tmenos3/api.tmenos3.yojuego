let yojuego = require('./indexes/yojuego');
let notifications = require('./indexes/notifications');

module.exports = (esClient, index) => {
  switch (index) {
    case 'yojuego':
      return yojuego(esClient);
    case 'notifications':
      return notifications(esClient);      
  
    default:
      return Promise.reject({code: 500, message: 'Invalid index name.', resp: null});
  }
}