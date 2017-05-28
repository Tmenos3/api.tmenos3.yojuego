//This should be configured individually for each environment
process.env.NODE_ENV = 'dev';

let databaseBootstrap = require('./src/services/databaseBootstrap/index');
let loginAdmin = require('./src/services/loginAdmin/index');
let restify = require('restify');
let configureServer = require('./src/configureServer');
let config = require('config');
let es = require('elasticsearch');
let esClient = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});

databaseBootstrap(restify, config, esClient)
loginAdmin(restify, config, esClient)