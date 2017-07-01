let device = {
  device: {
    properties: {
      userid: { type: "string", index: "not_analyzed" },
      deviceid: { type: "string", index: "not_analyzed" },
      type: { type: "string", index: "not_analyzed" },
      deviceAudit: {
        properties: {
          createdBy: { type: "string", index: "not_analyzed" },
          createdOn: { type: "date" },
          createdFrom: { type: "string" },
          modifiedBy: { type: "string", index: "not_analyzed" },
          modifiedOn: { type: "date" },
          modifiedFrom: { type: "string" }
        }
      }
    }
  }
}

let log = {
  log: {
    properties: {
      userid: { type: "string", index: "not_analyzed" },
      deviceid: { type: "string", index: "not_analyzed" },
      type: { type: "string", index: "not_analyzed" },
      date: { type: "date" },
      data: { type: "string" }
    }
  }
}

let errorLog = {
  errorLog: {
    properties: {
      userid: { type: "string", index: "not_analyzed" },
      deviceid: { type: "string", index: "not_analyzed" },
      type: { type: "string", index: "not_analyzed" },
      date: { type: "date" },
      error: { type: "string" }
    }
  }
}

let makePromise = (esClient, index, type, body) => {
  return new Promise((resolve, reject) => {
    esClient.indices.putMapping({ index, type, body }, (err, resp, respcode) => {
      if (err)
        reject(err);
      else
        resolve(resp);
    });
  });
}

let promises = (esClient) => {
  return [
    makePromise(esClient, 'notifications', 'device', device),
    makePromise(esClient, 'notifications', 'log', log),
    makePromise(esClient, 'notifications', 'errorLog', errorLog)
  ]
}

module.exports = (esClient) => {
  return Promise.all(promises(esClient));
}