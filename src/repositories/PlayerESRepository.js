import elasticSearch from 'elasticsearch';
import ESRepository from './ESRepository';

let client;

class PlayerESRepository {
  constructor(uri) {
    if (!uri) {
      throw new Error(ESRepository.INVALID_SOURCE);
    }
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
