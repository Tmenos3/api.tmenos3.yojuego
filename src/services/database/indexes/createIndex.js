module.exports = (esClient, index) => {
  return new Promise((resolve, reject) => {
    esClient.indices.create({ index: index }, (err, resp, respcode) => {
      if (err) return reject(err);

      return resolve(resp);
    })
  })
}
