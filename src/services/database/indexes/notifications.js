let createMappings = require('../mappings/notifications');
let createIndex = require('../mappings/createIndex');

module.exports = (esClient) => {
  return createIndex(esClient, 'notifications')
    .then((resp) => { return createMappings(esClient) });
}
