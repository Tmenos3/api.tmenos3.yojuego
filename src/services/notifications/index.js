let configureServer = require('./configureServer');
let NotificationService = require('./services/NotificationService');
let Configuration = require('./models/Configuration');

module.exports = (restify, config) => {
  let server = restify.createServer({ name: "notifications" });
  let notificationConfig = new Configuration({ API_KEY: 'sarasa' }, { API_KEY: 'sarasa' })
  let notificationService = new NotificationService(notificationConfig);

  configureServer(server, restify, notificationService);

  server.listen(config.serverConfig.ports[server.name], function () {
    console.log('%s listening at %s', server.name, server.url);
  });
}