let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Friendship = require('./Friendship');
let FriendshipRequest = require('./FriendshipRequest');

class FriendshipManager {
  constructor(repoFriendship, repoPlayer, repoFriendshipRequest, notificationService) {
    this._getFriendship = this._getFriendship.bind(this);
    this._checkPlayerFriendship = this._checkPlayerFriendship.bind(this);
    this._checkIfExistsPlayer = this._checkIfExistsPlayer.bind(this);
    this._checkIfAreFriends = this._checkIfAreFriends.bind(this);
    this._createFriendship = this._createFriendship.bind(this);
    this._createFriendshipRequest = this._createFriendshipRequest.bind(this);
    this._sendNotification = this._sendNotification.bind(this);
    this._updateFriendFriendship = this._updateFriendFriendship.bind(this);

    this._validator = new Validator();
    this._validator.addCondition(new NotNullOrUndefinedCondition(repoFriendship).throw(new Error(FriendshipManager.INVALID_FRIENDSHIP_REPO)));
    this._validator.addCondition(new NotNullOrUndefinedCondition(repoPlayer).throw(new Error(FriendshipManager.INVALID_PLAYER_REPO)));
    this._validator.addCondition(new NotNullOrUndefinedCondition(repoFriendshipRequest).throw(new Error(FriendshipManager.INVALID_FRIENDSHIP_REQUEST_REPO)));
    this._validator.addCondition(new NotNullOrUndefinedCondition(notificationService).throw(new Error(FriendshipManager.INVALID_NOTIFICATION_SERVICE)));

    this._validator.execute(() => {
      this._repoFriendship = repoFriendship;
      this._repoPlayer = repoPlayer;
      this._repoFriendshipRequest = repoFriendshipRequest;
      this._notificationService = notificationService;
    }, (err) => { throw err; });
  }

  get(id, playerId) {
    return new Promise((resolve, reject) => {
      this._validator = new Validator();
      this._validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(FriendshipManager.INVALID_ID)));

      this._validator.execute(() => {
        this._getFriendship(id)
          .then(friendship => {
            return this._checkPlayerFriendship(friendship, playerId);
          })
          .then(friendship => {
            friendship.friendshipAudit = undefined;
            resolve(friendship);
          })
          .catch(error => {
            reject(error);
          });
      }, (err) => { reject(err); });
    });
  }

  getAll(playerId) {
    return new Promise((resolve, reject) => {
      this._validator = new Validator();
      this._validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(FriendshipManager.INVALID_PLAYERID)));

      this._validator.execute(() => {
        this._repoFriendship.getByPlayerId(playerId)
          .then((resp) => {
            let frienships = [];
            if (resp.resp) {
              frienships = resp.resp.map(r => {
                r.friendshipAudit = undefined;
                return r;
              });
            }
            resolve(frienships);
          })
          .catch((error) => {
            reject(error);
          });
      }, (err) => { reject(err); });
    });
  }

  create(playerId, email) {
    return new Promise((resolve, reject) => {
      this._validator = new Validator();
      this._validator.addCondition(new NotNullOrUndefinedCondition(email).throw(new Error(FriendshipManager.INVALID_MAIL)));

      this._validator.execute(() => {
        let friend = null;
        let friendship = null;
        this._checkIfExistsPlayer(email)
          .then((friendResp) => {
            friend = friendResp;
            return this._checkIfAreFriends(playerId, friend._id);
          })
          .then(() => {
            return this._createFriendship(playerId, friend._id, email)
          })
          .then((friendshipResp) => {
            friendship = friendshipResp;
            return this._createFriendshipRequest(playerId, friendship._id, friend._id);
          })
          .then((friendshipRequestResp) => {
            let data = {
              type: 'NEW_FRIENDSHIP_REQUEST',
              id: friendshipRequestResp._id
            }
            return this._sendNotification(data, friend._id);
          })
          .then(friendshipResp => {
            friendship.friendshipAudit = undefined;
            resolve(friendship);
          })
          .catch(error => {
            reject(error);
          });
      }, (err) => { reject(err); });
    });
  }

  delete(id, playerId) {
    return new Promise((resolve, reject) => {
      this._validator = new Validator();
      this._validator.addCondition(new NotNullOrUndefinedCondition(id).throw(new Error(FriendshipManager.INVALID_ID)));
      this._validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(FriendshipManager.INVALID_PLAYERID)));

      this._validator.execute(() => {
        let friendship = null;
        this._getFriendship(id)
          .then(friendshipResp => {
            friendship = friendshipResp;
            return this._checkPlayerFriendship(friendship, playerId);
          })
          .then(() => {
            return this._repoFriendship.delete(friendship);
          })
          .then(() => {
            return this._updateFriendFriendship(friendship.friendId, playerId);
          })
          .then(() => {
            let data = {
              type: 'FRIENDSHIP_DELETED',
              id: friendship.playerId
            }
            return this._sendNotification(data, friendship.friendId);
          })
          .then(() => {
            friendship.friendshipAudit = undefined;
            resolve(friendship);
          })
          .catch(error => {
            reject(error);
          });
      }, (err) => { reject(err); });
    });
  }

  _getFriendship(id) {
    return this._repoFriendship.get(id)
      .then((friendshipResp) => {
        if (!friendshipResp.resp)
          return Promise.reject({ code: 404, message: 'Friendship inexistente', resp: null });

        return Promise.resolve(friendshipResp.resp);
      });
  }

  _checkPlayerFriendship(friendship, playerId) {
    return new Promise((resolve, reject) => {
      if (friendship.playerId != playerId)
        reject({ code: 405, message: 'Inconsistencia entre Friendship y Player', resp: null });

      resolve(friendship);
    });
  }

  _checkIfExistsPlayer(email) {
    return this._repoPlayer.getByEmail(email)
      .then((resp) => {
        if (!resp.resp)
          return Promise.reject({ code: 404, message: 'Tu amigo todavia no se registro.', resp: null });

        return Promise.resolve(resp.resp);
      });
  }

  _checkIfAreFriends(playerId, friendId) {
    return this._repoFriendship.getByPlayerIdAndFriendId(playerId, friendId)
      .then(respFriendship => {
        if (respFriendship.resp)
          return Promise.reject({ code: 400, message: 'Ya son amigos.', resp: null });

        return Promise.resolve();
      })
  }

  _createFriendship(playerId, friendId, email) {
    let friendship = new Friendship(playerId, friendId, 'CREATED', email);
    friendship.friendshipAudit = {
      createdBy: playerId, //We should store deviceId here
      createdOn: new Date(),
      createdFrom: 'MOBILE_APP',
      modifiedBy: null,
      modifiedOn: null,
      modifiedFrom: null
    }
    return this._repoFriendship.add(friendship)
      .then((resp) => {
        return this._repoFriendship.get(resp.resp._id);
      })
      .then((resp) => {
        return Promise.resolve(resp.resp);
      });
  }

  _createFriendshipRequest(playerId, friendshipId, friendId) {
    let fr = new FriendshipRequest(friendshipId, friendId, 'PENDING', new Date());
    fr.friendshipRequestAudit = {
      createdBy: playerId, //We should store deviceId here
      createdOn: new Date(),
      createdFrom: 'MOBILE_APP',
      modifiedBy: null,
      modifiedOn: null,
      modifiedFrom: null
    }
    return this._repoFriendshipRequest.add(fr)
      .then((resp) => {
        return Promise.resolve(resp.resp);
      });
  }

  _updateFriendFriendship(playerId, friendId) {
    return this._repoFriendship.getByPlayerIdAndFriendId(playerId, friendId)
      .then((resp) => {
        if (!resp.resp) return Promise.resolve();

        resp.resp.status = 'DELETED';
        resp.resp.info = null;

        return repoFriendship.update(resp.resp);
      });
  }

  _sendNotification(data, userid) {
    return this._notificationService.send([userid], data);
  }

  static INVALID_FRIENDSHIP_REPO() {
    return 'EL repositorio de friendship no puede ser null.';
  }

  static INVALID_PLAYER_REPO() {
    return 'EL repositorio de player no puede ser null.';
  }

  static INVALID_FRIENDSHIP_REQUEST_REPO() {
    return 'EL repositorio de friendship request no puede ser null.';
  }

  static INVALID_NOTIFICATION_SERVICE() {
    return 'EL notification service no puede ser null.';
  }

  static INVALID_ID() {
    return 'EL id no puede ser null.';
  }

  static INVALID_PLAYERID() {
    return 'EL player id no puede ser null.';
  }

  static INVALID_MAIL() {
    return 'EL mail no puede ser null.';
  }
}

module.exports = FriendshipManager;