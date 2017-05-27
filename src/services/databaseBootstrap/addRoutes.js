let createIndex = require('./createIndex');
let deleteIndex = require('./deleteIndex');
let createMappings = require('./createMappings');

let checkIndexName = (req, res, next) => {
  if (!req.params.index) res.json(400, { error: 'invalid index name.' })
  else next()
}

//Add here middlewere to check tokens and claims
module.exports = (server, esClient) => {
  server.get('/database/health', (req, res, next) => {
    esClient.cluster.health({ requestTimeout: 5000 }, (error, response) => {
      if (error) res.json(400, { error })
      else res.json(200, { resp: response })
    });
  });
  server.get('/database/status', (req, res, next) => {
    esClient.ping({
      requestTimeout: 5000,
    }, (error) => {
      if (error) res.json(400, { error })
      else res.json(200, { resp: 'Running...' })
    });
  });
  server.put('/database/:index',
    checkIndexName,
    (req, res, next) => {
      createIndex(esClient, req.params.index)
        .then((resp) => { return createMappings(esClient, req.params.index) })
        .then((resp) => { res.json(200, { resp }) })
        .catch((error) => res.json(500, { error }));
    });

  server.del('/database/:index',
    checkIndexName,
    (req, res, next) => {
      deleteIndex(esClient, req.params.index)
        .then((resp) => { res.json(200, { resp }) })
        .catch((error) => res.json(500, { error }));
    });
}