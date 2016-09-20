var ESRepository = require('./ESRepository');
var Player = require('../models/Player');

class PlayerESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    getById(playerId) {
        return new Promise((resolve, reject) => {
            super.getById(playerId, 'yojuego', 'player')
                .then((objRet) => {
                    var player = new Player(objRet.source.nickName, new Date(objRet.source.birthDate), objRet.source.state, objRet.source.adminState, objRet.source.userID);
                    player.id = objRet._id
                    resolve(player);
                }, reject);
        });
    }

    getBy(criteria) {
        return new Promise((resolve, reject) => {
            super.getBy(criteria, 'yojuego', 'player')
                .then((list) => {
                    var ret = [];

                    for (let i = 0; i < list.length; i++) {
                        var player = new Player(list[i]._source.nickName, new Date(list[i]._source.birthDate), list[i]._source.state, list[i]._source.adminState, list[i]._source.userID);
                        player.id = list[i]._id;
                        ret.push(player);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    getByUserId(userid) {
        // return new Promise((resolve, reject) => {
        //     super.getBy({
        //         "query": {
        //             "bool": {
        //                 "filter": [
        //                     { "term": { "userID": userid } }
        //                 ]
        //             }
        //         }
        //     }, 'yojuego', 'player')
        //         .then((ret) => {
        //             let player = null;

        //             for (let i = 0; i < ret.resp.length; i++) {
        //                 player = new Player(ret.resp[i]._source.nickName, new Date(ret.resp[i]._source.birthDate), ret.resp[i]._source.state, ret.resp[i]._source.adminState, ret.resp[i]._source.userID);
        //                 player._id = ret.resp[i]._id;
        //                 break;
        //             }

        //             resolve(player);
        //         }, reject);
        // });
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "player",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "userID": userid } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let player = null;

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        player = new Player(response.hits.hits[i]._source.nickName, new Date(response.hits.hits[i]._source.birthDate), response.hits.hits[i]._source.state, response.hits.hits[i]._source.adminState, response.hits.hits[i]._source.userID);
                        player._id = response.hits.hits[i]._id;
                        break;
                    }

                    resolve(player);
                }
            });
        });
    }

    add(player) {
        return super.add(player, 'yojuego', 'player');
    }

    update(player) {
        let document = {
            nickName: player.nickName,
            birthDate: player.birthDate,
            state: player.state,
            adminState: player.adminState
        };
        return super.update(player._id, document, 'yojuego', 'player');
    }
}

module.exports = PlayerESRepository;
