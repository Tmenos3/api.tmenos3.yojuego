var elasticSearch = require('elasticsearch');

let client;

class PlayerESRepository {
  constructor(uri) {
    client = new elasticsearch.Client({
      host: uri + ':9200',
      log: 'trace'
    });
  }

  add(user) {

  }

  getById(userId) {
    return null;
  }
}

module.exports = PlayerESRepository;
