let configureServer = require('./configureServer');
let NotificationService = require('./services/NotificationService');
let Configuration = require('./models/Configuration');
let DeviceRepository = require('./repositories/DeviceESRepository');

module.exports = (restify, config, esClient) => {
  let server = restify.createServer({ name: "notifications" });
  let notificationConfig = new Configuration({ API_KEY: config.get('gcmService').serverApiKey }, { API_KEY: config.get('gcmService').serverApiKey })
  let notificationService = new NotificationService(notificationConfig);
  let deviceRepository = new DeviceRepository(esClient);

  configureServer(server, restify, deviceRepository, notificationService);

  server.listen(config.serverConfig.ports[server.name], function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}