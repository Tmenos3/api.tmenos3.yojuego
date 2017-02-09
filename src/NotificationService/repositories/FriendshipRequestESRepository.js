let ESRepository = require('../../repositories/ESRepository');
let FriendshipRequest = require('../models/FriendshipRequest');

class FriendshipRequestESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._map = this._map.bind(this);
        this._getDocument = this._getDocument.bind(this);
        this._getQueryByPendingAndPlayerId = this._getQueryByPendingAndPlayerId.bind(this);
    }

    get(friendshipRequestId) {
        return new Promise((resolve, reject) => {
            super.get(friendshipRequestId, 'yojuego', 'friendshipRequest')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'FriendshipRequest does not exist', resp: null });
                    } else {
                        let user = this._map(objRet.resp._id, objRet.resp._source);
                        resolve({ code: 200, message: null, resp: user });
                    }
                }, reject);
        });
    }

    getPendingByPlayerId(playerId) {
        //TEST: not null, not undefined
        //TEST: instance of string both
        return new Promise((resolve, reject) => {
            super.getBy(this._getQueryByPendingAndPlayerId(playerId), 'yojuego', 'friendshipRequest')
                .then((objRet) => {
                    let ret = [];
                    for (let i = 0; i < objRet.resp.length; i++) {
                        let elem = this._map(objRet.resp[i]._id, objRet.resp[i]._source);
                        ret.push(elem);
                    }

                    resolve({ code: 200, message: null, resp: ret });
                }, reject);
        });
    }

    add(friendshipRequest) {
        //TEST: not null, not undefined
        //TEST: instance of User
        //TEST: return a friendshipRequest
        return new Promise((resolve, reject) => {
            super.add(friendshipRequest, 'yojuego', 'friendshipRequest')
                .then((resp) => {
                    let newFriendshipRequest = this._map(resp.resp._id, friendshipRequest);
                    resolve({ code: 200, message: FriendshipRequestESRepository.DOCUMENT_INSERTED, resp: newFriendshipRequest });
                }, reject)
        });
    }

    update(friendshipRequest) {
        //TEST: not null, not undefined
        //TEST: instance of friendshipRequest
        return new Promise((resolve, reject) => {
            if (friendshipRequest instanceof FriendshipRequest) {
                let document = this._getDocument(friendshipRequest);
                super.update(friendshipRequest._id, document, 'yojuego', 'friendshipRequest')
                    .then((resp) => {
                        resolve({ code: 200, message: FriendshipRequestESRepository.DOCUMENT_UPDATED, resp: friendshipRequest });
                    }, reject);
            } else {
                reject({ code: 410, message: FriendshipRequestESRepository.INVALID_INSTANCE, resp: null });
            }
        });
    }

    delete(friendshipRequest) {
        //TEST: not null, not undefined
        //TEST: instance of friendshipRequest
        return new Promise((resolve, reject) => {
            if (friendshipRequest instanceof FriendshipRequest) {
                super.delete(friendshipRequest._id, 'yojuego', 'friendshipRequest').then(resolve, reject);
            } else {
                reject({ code: 410, message: FriendshipRequestESRepository.INVALID_INSTANCE, resp: null });
            }
        });
    }

    _map(id, source) {
        let friendshipRequest = new FriendshipRequest(source.friendshipId, source.playerId, source.status, source.sendedOn, source.receivedOn);
        friendshipRequest._id = id
        friendshipRequest.friendshipRequestAudit = source.friendshipRequestAudit;

        return friendshipRequest;
    }

    _getDocument(friendshipRequest) {
        let document = {
            friendshipId: friendshipRequest.type,
            playerId: friendshipRequest.playerId,
            status: friendshipRequest.status,
            sendedOn: friendshipRequest.sendedOn,
            receivedOn: friendshipRequest.receivedOn,
            friendshipRequestAudit: {
                createdBy: friendshipRequest.friendshipRequestAudit.createdBy,
                createdOn: friendshipRequest.friendshipRequestAudit.createdOn,
                createdFrom: friendshipRequest.friendshipRequestAudit.createdFrom,
                modifiedBy: friendshipRequest.friendshipRequestAudit.modifiedBy,
                modifiedOn: friendshipRequest.friendshipRequestAudit.modifiedOn,
                modifiedFrom: friendshipRequest.friendshipRequestAudit.modifiedFrom
            }
        };

        return document;
    }

    _getQueryByPendingAndPlayerId(playerId) {
        return {
            "bool": {
                "filter": [
                    { "term": { "playerId": playerId } },
                    { "term": { "status": "PENDING" } }
                ]
            }
        };
    }

    static get INVALID_USER() {
        return "Invalid User";
    }

    static get INVALID_INSTANCE() {
        return 'This instance is not a FriendshipRequest';
    }
}

module.exports = FriendshipRequestESRepository;