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
        return new Promise((resolve, reject) => {
            super.getBy(this._getCriteriaByUserId(userid), 'yojuego', 'player')
                .then((list) => {
                    let player = null;

                    for (let i = 0; i < list.length; i++) {
                        player = new Player(list[i]._source.nickName, new Date(list[i]._source.birthDate), list[i]._source.state, list[i]._source.adminState, list[i]._source.userID);
                        player.id = list[i]._id;
                        break;
                    }

                    resolve(player);
                }, reject);
        });
    }

    add(player) {
        // return new Promise((resolve, reject) => {
        //     super.add(player, 'yojuego', 'player')
        //         .then(resolve, reject);
        // });
        return super.add(player, 'yojuego', 'player');
    }

    update(player){
        let document = {
            _id: player.id,
            source: {
                nickName: player.nickName,
                birthDate: player.birthDate,
                state: player.state,
                adminState: player.adminState
            }
        }

        return super.update(document, 'yojuego', 'player');
    }

    _getCriteriaByUserId(userid) {
        return {
            "bool": {
                "must": [
                    { "term": { "userid": userid } }
                ]
            }
        }
    }

    static get INVALID_PLAYER() {
        return "Invalid Player";
    }
}

module.exports = PlayerESRepository;
