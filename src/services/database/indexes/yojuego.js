let createMappings = require('../mappings/yojuego');
let createIndex = require('../mappings/createIndex');

module.exports = (esClient) => {
  return createIndex(esClient, 'yojuego')
    .then((resp) => { return createMappings(esClient) });
}
