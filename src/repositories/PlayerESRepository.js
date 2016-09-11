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
                    var player = new Player(objRet.source.nickName, new Date(objRet.source.birthDate), objRet.source.state, objRet.source.adminState);
                    player.id = objRet._id;
                    player.account = objRet.source.account;
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
                        var player = new Player(list[i]._source.nickName, new Date(list[i]._source.birthDate), list[i]._source.state, list[i]._source.adminState);
                        player.id = list[i]._id;
                        player.account = list[i]._source.account;
                        ret.push(player);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    add(player) {
        return new Promise((resolve, reject) => {
            super.add(player, 'yojuego', 'player')
                .then(resolve, reject);
        });
    }

    static get INVALID_PLAYER() {
        return "Invalid Player";
    }
}

module.exports = PlayerESRepository;
