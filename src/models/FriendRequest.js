'use strict'

var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
var NotIsTypeOfIntegerCondition = require('../helpers/CommonValidator/NotIsTypeOfIntegerCondition');
var CustomCondition = require('../helpers/CommonValidator/CustomCondition');

class FriendRequest {
    constructor(sender, recipient) {
        var conditions = [
            new NotNullOrUndefinedCondition(sender, FriendRequest.INVALID_SENDER()),
            new NotIsTypeOfIntegerCondition(sender, FriendRequest.INVALID_SENDER()),
            new NotNullOrUndefinedCondition(recipient, FriendRequest.INVALID_RECIPIENT()),
            new NotIsTypeOfIntegerCondition(recipient, FriendRequest.INVALID_RECIPIENT()),
            new CustomCondition(() => { return sender !== recipient }, FriendRequest.INVALID_SENDER_AND_RECIPIENT_ARE_EQUALS())
        ];
        var validator = new CommonValidatorHelper(conditions, () => {
            this.sender = sender;
            this.recipient = recipient;
            this.state = FriendRequest.FRIEND_REQUEST_CREATED_STATE();
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    acceptRequest() {
        this.state = FriendRequest.FRIEND_REQUEST_ACCEPTED_STATE();
    }
    rejectedRequest() {
        this.state = FriendRequest.FRIEND_REQUEST_REJECTED_STATE();
    }
    static FRIEND_REQUEST_CREATED_STATE() {
        return 'created';
    }
    static FRIEND_REQUEST_ACCEPTED_STATE() {
        return 'accepted';
    }
    static FRIEND_REQUEST_REJECTED_STATE() {
        return 'rejected';
    }
    static INVALID_SENDER() {
        return 'El remitente es indefinido, nulo ó no es del tipo integer.';
    }

    static INVALID_RECIPIENT() {
        return 'El destinatario es indefinido, nulo ó no es del tipo integer.';
    }

    static INVALID_SENDER_AND_RECIPIENT_ARE_EQUALS() {
        return 'El remitente y el destinatario no pueden ser el mismo';
    }
}
module.exports = FriendRequest;