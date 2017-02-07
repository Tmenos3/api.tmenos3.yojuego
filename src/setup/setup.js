// var es = require('elasticsearch');
var createUser = require('./createUser');
// var createPlayer = require('./createPlayer');
// var createMatch = require('./createMatch');
// var createInvitation = require('./createInvitation');
// var createFriendship = require('./createFriendship');
// var createGroup = require('./createGroup');
// var config = require('config');
// var client = new es.Client({
//     host: config.dbConfig.database,
//     log: 'info'
// });

let createSchema = (client) => {
    return new Promise((resolve, reject) => {
        client.indices.create({ index: 'yojuego' }, (err, resp, respcode) => {
            if (err)
                reject(err);
            else
                return createUser(client)
                    .then((resp) => {
                        resolve(resp);
                    });
        })
        // .then(() => {
        //     return createPlayer(client);
        // })
        // .then(() => {
        //     return createMatch(client);
        // })
        // // .then(() => {
        // //     return createInvitation(client);
        // // })
        // .then(() => {
        //     return createFriendship(client);
        // })
        // .then(() => {
        //     return createGroup(client);
        // })
    });
}

module.exports = createSchema;