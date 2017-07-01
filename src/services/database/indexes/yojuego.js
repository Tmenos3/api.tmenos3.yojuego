let createMappings = require('../mappings/yojuego');
let createIndex = require('./createIndex');

module.exports = (esClient) => {
  return createIndex(esClient, 'yojuego')
    .then((resp) => { return createMappings(esClient) });
}
