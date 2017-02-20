let ESRepository = require('./ESRepository');
let Friendship = require('../models/Friendship');

class FriendshipESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapFriendship = this._mapFriendship.bind(this);
        this._getQueryByPlayerId = this._getQueryByPlayerId.bind(this);
        this._getQueryByFriendId = this._getQueryByFriendId.bind(this);
        this._getDocument = this._getDocument.bind(this);
    }

    get(friendshipId) {
        return super.get(friendshipId, 'yojuego', 'friendship')
            .then((objRet) => {
                if (objRet.code == 404) {
                    resolve({ code: 404, message: 'Friendship does not exist', resp: null });
                } else {
                    let friendship = this._mapFriendship(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: friendship };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByPlayerId(playerId) {
        return super.getBy(this._getQueryByPlayerId(playerId), 'yojuego', 'friendship')
            .then((objRet) => {
                let friendships = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let friendship = this._mapFriendship(objRet.resp[i]._id, objRet.resp[i]._source);
                    friendships.push(friendship);
                }

                return { code: 200, message: null, resp: friendships };
            }, (error) => { return Promise.reject(error); });
    }

    getByFriendId(friendId) {
        return super.getBy(this._getQueryByFriendId(friendId), 'yojuego', 'friendship')
            .then((objRet) => {
                let friendships = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let friendship = this._mapFriendship(objRet.resp[i]._id, objRet.resp[i]._source);
                    friendships.push(friendship);
                }

                return { code: 200, message: null, resp: friendships };
            }, (error) => { return Promise.reject(error); });
    }

    add(friendship) {
        if (friendship instanceof Friendship) {
            return super.add(friendship, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP, resp: null });
        }
    }

    update(friendship) {
        if (friendship instanceof Friendship) {
            let document = this._getDocument(friendship);
            return super.update(friendship._id, document, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP, resp: null });
        }
    }

    delete(friendship) {
        if (friendship instanceof Friendship) {
            return super.delete(friendship._id, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP });
        }
    }

    _getDocument(friendship) {
        let document = {
            playerId: friendship.playerId,
            friendId: friendship.friendId,
            status: friendship.status,
            email: friendship.email,
            friendshipAudit: {
                createdBy: friendship.friendshipAudit.createdBy,
                createdOn: friendship.friendshipAudit.createdOn,
                createdFrom: friendship.friendshipAudit.createdFrom,
                modifiedBy: friendship.friendshipAudit.modifiedBy,
                modifiedOn: friendship.friendshipAudit.modifiedOn,
                modifiedFrom: friendship.friendshipAudit.modifiedFrom
            }
        };

        return document;
    }

    _getQueryByFriendId(friendId) {
        return {
            "bool": {
                "filter": [
                    { "term": { "friendId": friendId } }
                ]
            }
        };
    }

    _getQueryByPlayerId(playerId) {
        return {
            "bool": {
                "filter": [
                    { "term": { "playerId": playerId } }
                ]
            }
        };
    }

    _mapFriendship(id, source) {
        let friendship = new Friendship(source.playerId, source.friendId, source.status, source.email);
        friendship._id = id;
        friendship.friendshipAudit = source.friendshipAudit;

        return friendship;
    }

    static get INVALID_INSTANCE_FRIENDSHIP() {
        return "Invalid friendship";
    }
}
module.exports = FriendshipESRepository;