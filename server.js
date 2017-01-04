//This should be configured individually for each environment
process.env.NODE_ENV = 'dev';

var restify = require('restify');
var configureServer = require('./src/configureServer');
var config = require('config');

var server = restify.createServer();

configureServer(server, restify);

server.listen(config.serverConfig.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});
