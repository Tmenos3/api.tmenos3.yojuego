//This should be configured individually for each environment
process.env.NODE_ENV = 'dev';

let restify = require('restify');
let configureServer = require('./src/configureServer');
let NotificationService = require('./src/common/NotificationService');
let config = require('config');
let es = require('elasticsearch');
let client = new es.Client({
  host: config.get('dbConfig').database,
  log: 'info'
});
let websocket = require('./src/services/websocket/index');
let notifications = require('./src/services/notifications/index');
let friendship = require('./src/services/friendship/index');
let notificationService = new NotificationService();

let server = restify.createServer();

configureServer(server, restify, client, notificationService);

server.listen(config.serverConfig.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

websocket(restify, config, client);
notifications(restify, config, client);
friendship(restify, config, client);
