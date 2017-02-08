let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class FriendshipRequest {
  constructor(friendshipId, playerId, status, sendedOn, receivedOn) {
    var validator = new Validator();
    validator.addCondition(new NotNullOrUndefinedCondition(friendshipId).throw(new Error(FriendshipRequest.INVALID_FRIENDSHIP)));
    validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(FriendshipRequest.INVALID_PLAYER)));
    validator.addCondition(new NotNullOrUndefinedCondition(sendedOn).throw(new Error(FriendshipRequest.INVALID_STATUS)));
    validator.addCondition(new NotNullOrUndefinedCondition(status).throw(new Error(FriendshipRequest.INVALID_SENDEDON)));

    validator.execute(() => {
      this.friendshipId = friendshipId;
      this.playerId = playerId;
      this.sendedOn = sendedOn;
      this.receivedOn = receivedOn || null;
      this.status = status;
    }, (err) => { throw err; });
  }

  static get INVALID_FRIENDSHIP() {
    return 'Invalid friendship';
  }

  static get INVALID_PLAYER() {
    return 'Invalid player';
  }

  static get INVALID_STATUS() {
    return 'Invalid status';
  }

  static get INVALID_SENDEDON() {
    return 'Invalid sended on date';
  }
}

module.exports = FriendshipRequest;