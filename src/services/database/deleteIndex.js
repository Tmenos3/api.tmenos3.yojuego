module.exports = (esClient, index) => {
  return new Promise((resolve, reject) => {
    esClient.indices.delete({ index: index }, (err, resp, respcode) => {
      if (err)
        reject(err);
      else
        resolve(resp);
    })
  });
}