//This should be configured individually for each environment
process.env.NODE_ENV = 'dev';

let restify = require('restify');
let config = require('config');
let configureServer = require('./src/configureServer');

let server = restify.createServer();

configureServer(server, restify);

server.listen(config.serverConfig.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
