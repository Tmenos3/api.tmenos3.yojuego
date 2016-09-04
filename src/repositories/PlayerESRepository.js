import ESRepository from './ESRepository';
import Player from '../models/Player';

class PlayerESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    getById(playerId) {
        return new Promise((resolve, reject) => {
            super.getById(playerId, 'app', 'player')
                .then((objRet) => {
                    var player = new Player(objRet.source.nickName, new Date(objRet.source.birthDate), objRet.source.state, objRet.source.adminState);
                    player.id = objRet._id;
                    resolve(player);
                }, reject);
        });
    }

    getBy(criteria) {
        return new Promise((resolve, reject) => {
            super.getBy(criteria, 'app', 'player')
                .then((list) => {
                    var ret = [];

                    for (let i = 0; i < list.length; i++) {
                        var player = new Player(list[i].source.nickName, new Date(list[i].source.birthDate), list[i].source.state, list[i].source.adminState);
                        player.id = list[i]._id;
                        ret.push(player);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    add(player) {
        return new Promise((resolve, reject) => {
            super.add(player, 'app', 'player')
                .then(resolve, reject);
        });
    }

    static get INVALID_PLAYER() {
        return "Invalid Player";
    }
}

module.exports = PlayerESRepository;
