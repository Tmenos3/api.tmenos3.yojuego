import ESRepository from './ESRepository';

class PlayerESRepository extends ESRepository {
  static get INVALID_PLAYER() {
    return "Invalid Player";
  }

  add(player) {
    return new Promise(function (resolve, reject) {
      if (!player) {
        reject(PlayerESRepository.INVALID_PLAYER);
      }
    });
  }

  getById(playerId) {
    return null;
  }
}

module.exports = PlayerESRepository;
