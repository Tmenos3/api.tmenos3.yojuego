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
          var player = new Player(objRet.id, objRet.nickName, objRet.birthDate, objRet.state);
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
            ret.push(new Player(list[i]._id, list[i].source.nickName, new Date(list[i].source.birthDate), list[i].source.state));
          }

          resolve(ret);
        }, reject);
    });
  }

  add(player) {
    return new Promise((resolve, reject) => {
      var document = {
        nickName: player.nickName,
        birthDate: player.birthDate,
        state: player.state
      };
      super.add(document, 'app', 'player')
        .then(resolve, reject);
    });
  }

  static get INVALID_PLAYER() {
    return "Invalid Player";
  }
}

module.exports = PlayerESRepository;
