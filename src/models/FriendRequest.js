'use strict'

import { Validator,
         NotNullOrUndefinedCondition,
         CustomCondition } from 'no-if-validator';

class FriendRequest {
    constructor(sender, recipient) {
        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(sender).throw(new Error(FriendRequest.INVALID_SENDER)));
        validator.addCondition(new NotNullOrUndefinedCondition(recipient).throw(new Error(FriendRequest.INVALID_RECIPIENT)));
        validator.addCondition(new CustomCondition(() => { return sender !== recipient }).throw(new Error(FriendRequest.INVALID_SENDER_AND_RECIPIENT_ARE_EQUALS)));

        validator.execute(() => {
            this.sender = sender;
            this.recipient = recipient;
            this.state = FriendRequest.FRIEND_REQUEST_CREATED_STATE();
        }, (err) => { throw err; });
    }

    acceptRequest() {
        this.state = FriendRequest.FRIEND_REQUEST_ACCEPTED_STATE();
    }
    rejectedRequest() {
        this.state = FriendRequest.FRIEND_REQUEST_REJECTED_STATE();
    }
    static get FRIEND_REQUEST_CREATED_STATE() {
        return 'created';
    }
    static get FRIEND_REQUEST_ACCEPTED_STATE() {
        return 'accepted';
    }
    static get FRIEND_REQUEST_REJECTED_STATE() {
        return 'rejected';
    }
    static get INVALID_SENDER() {
        return 'El remitente es indefinido, nulo ó no es del tipo integer.';
    }

    static get INVALID_RECIPIENT() {
        return 'El destinatario es indefinido, nulo ó no es del tipo integer.';
    }

    static get INVALID_SENDER_AND_RECIPIENT_ARE_EQUALS() {
        return 'El remitente y el destinatario no pueden ser el mismo';
    }
}
module.exports = FriendRequest;