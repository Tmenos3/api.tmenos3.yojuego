//This should be configured individually for each environment
process.env.NODE_ENV = 'dev';

let restify = require('restify');
let configureServer = require('./src/configureServer');
let config = require('config');
let es = require('elasticsearch');
let client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});
let websocket = require('./src/services/websocket/index');

let server = restify.createServer();

configureServer(server, restify, client);

server.listen(config.serverConfig.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

websocket(restify, config, client);
