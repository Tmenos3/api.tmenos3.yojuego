let configureServer = require('./configureServer');
let NotificationService = require('../../common/NotificationService');
let Configuration = require('../../models/Configuration');
let FriendshipManager = require('../../models/FriendshipManager');
let FriendshipRepository = require('../../repositories/FriendshipESRepository');
let FriendshipRequestRepository = require('../../repositories/FriendshipRequestESRepository');
let PlayerRepository = require('../../repositories/PlayerESRepository');

module.exports = (restify, config, esClient) => {
  let server = restify.createServer({ name: "friendship" });
  let notificationConfig = new Configuration({ API_KEY: config.get('gcmService').serverApiKey }, { API_KEY: config.get('gcmService').serverApiKey })
  let friendshipManager = new FriendshipManager(
    new FriendshipRepository(esClient),
    new PlayerRepository(esClient),
    new FriendshipRequestRepository(esClient),
    new NotificationService(notificationConfig)
  );

  configureServer(server, restify, config, friendshipManager, esClient);

  server.listen(config.serverConfig.ports[server.name], function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}