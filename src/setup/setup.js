var es = require('elasticsearch');
var createUser = require('./createUser');
var createPlayer = require('./createPlayer');
var createMatch = require('./createMatch');
var createInvitation = require('./createInvitation');
var client = new es.Client({
    host: config.database,
    log: 'info'
});

let createSchema = (client) => {
    return client.indices.create({ index: 'yojuego' })
        .then(() => { return createUser(client); })
        .then(() => { return createPlayer(client); })
        .then(() => { return createMatch(client); })
        .then(() => { return createInvitation(client); });
}

module.exports = createSchema;