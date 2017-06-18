let user = require('./mappings').user;
let player = require('./mappings').player;
let match = require('./mappings').match;
let friendship = require('./mappings').friendship;
let group = require('./mappings').group;
let friendshipRequest = require('./mappings').friendshipRequest;
let matchInvitation = require('./mappings').matchInvitation;

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

let promises = (esClient, index) => {
  return [
    makePromise(esClient, index, "user", user),
    makePromise(esClient, index, "player", player),
    makePromise(esClient, index, "match", match),
    makePromise(esClient, index, "friendship", friendship),
    makePromise(esClient, index, "group", group),
    makePromise(esClient, index, "friendshipRequest", friendshipRequest),
    makePromise(esClient, index, "matchInvitation", matchInvitation)
  ]
}

module.exports = (esClient, index) => {
  return Promise.all(promises(esClient, index));
}