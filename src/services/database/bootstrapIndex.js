let yojuego = require('./bootstrap/yojuego');

module.exports = (esClient, index) => {
  switch (index) {
    case 'yojuego':
      return yojuego(esClient);  
  
    default:
      return Promise.reject({code: 500, message: 'Invalid index name.', resp: null});
  }
}