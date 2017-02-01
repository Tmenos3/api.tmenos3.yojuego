let ESRepository = require('./ESRepository');
let Friendship = require('../models/Friendship');

class FriendshipESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(friendshipId) {
        return new Promise((resolve, reject) => {
            super.get(friendshipId, 'yojuego', 'friendship')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'Friendship does not exist', resp: null });
                    } else {
                        let friendship = new Friendship(objRet.resp._source.playerId, objRet.resp._source.friendId, objRet.resp._source.status, objRet.resp._source.info);
                        friendship._id = objRet.resp._id;
                        resolve({ code: 200, message: null, resp: friendship });
                    }
                }, reject);
        });
    }

    getByPlayerId(playerId) {
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "friendship",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "playerId": playerId } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let friendships = [];

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        let source = response.hits.hits[i]._source;
                        let friendship = new Friendship(source.playerId, source.friendId, source.status, source.info);
                        friendship._id = response.hits.hits[i]._id;

                        friendships.push(friendship);
                    }

                    resolve({ code: 200, message: null, resp: friendships });
                }
            });
        });
    }

    getByFriendId(friendId) {
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "friendship",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "friendId": friendId } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let friendships = [];

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        let source = response.hits.hits[i]._source;
                        let friendship = new Friendship(source.playerId, source.friendId, source.status, source.info);
                        friendship._id = response.hits.hits[i]._id;

                        friendships.push(friendship);
                    }

                    resolve({ code: 200, message: null, resp: friendships });
                }
            });
        });
    }

    add(friendship) {
        if (friendship instanceof Friendship) {
            return super.add(friendship, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP });
        }
    }

    update(friendship) {
        if (friendship instanceof Friendship) {
            let document = {
                playerId: friendship.playerId,
                friendId: friendship.friendId,
                status: friendship.status,
                info: friendship.info
            };
            return super.update(friendship._id, document, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP });
        }
    }

    delete(friendship) {
        if (friendship instanceof Friendship) {
            return super.delete(friendship._id, 'yojuego', 'friendship');
        } else {
            return Promise.reject({ code: 410, message: FriendshipESRepository.INVALID_INSTANCE_FRIENDSHIP });
        }
    }

    static get INVALID_INSTANCE_FRIENDSHIP() {
        return "Invalid friendship";
    }
}
module.exports = FriendshipESRepository;