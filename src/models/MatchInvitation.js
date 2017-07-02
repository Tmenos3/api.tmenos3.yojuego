let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;

class MatchInvitation {
  constructor(matchId, playerId, senderId, status, sendedOn, receivedOn) {
    var validator = new Validator();
    validator.addCondition(new NotNullOrUndefinedCondition(matchId).throw(new Error(MatchInvitation.INVALID_MATCH)));
    validator.addCondition(new NotNullOrUndefinedCondition(playerId).throw(new Error(MatchInvitation.INVALID_PLAYER)));
    validator.addCondition(new NotNullOrUndefinedCondition(senderId).throw(new Error(MatchInvitation.INVALID_SENDER)));
    validator.addCondition(new NotNullOrUndefinedCondition(status).throw(new Error(MatchInvitation.INVALID_STATUS)));
    validator.addCondition(new NotNullOrUndefinedCondition(sendedOn).throw(new Error(MatchInvitation.INVALID_SENDEDON)));

    validator.execute(() => {
      this.matchId = matchId;
      this.playerId = playerId;
      this.senderId = senderId;
      this.status = status;
      this.sendedOn = sendedOn;
      this.receivedOn = receivedOn || null;
    }, (err) => { throw err; });
  }

  static get INVALID_MATCH() {
    return 'Invalid match';
  }

  static get INVALID_PLAYER() {
    return 'Invalid player';
  }

  static get INVALID_SENDER() {
    return 'Invalid sender';
  }

  static get INVALID_STATUS() {
    return 'Invalid status';
  }

  static get INVALID_SENDEDON() {
    return 'Invalid sended on date';
  }
}

module.exports = MatchInvitation;