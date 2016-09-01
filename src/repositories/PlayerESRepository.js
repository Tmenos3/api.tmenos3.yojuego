import ESRepository from './ESRepository';

class PlayerESRepository extends ESRepository {
  
  static get INVALID_PLAYER() {
    return "Invalid Player";
  }

  add(player) { 
    return new Promise(function (resolve, reject) {
      if (!player && player != null) {
        reject(PlayerESRepository.INVALID_PLAYER);
      }
    });
  }

  getById(playerId) {
    super.getById('app', 'player', playerId)
  }
}

module.exports = PlayerESRepository;
