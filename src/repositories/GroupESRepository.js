let ESRepository = require('./ESRepository');
let Group = require('../models/Group');

class GroupESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(groupId) {
        return new Promise((resolve, reject) => {
            super.get(groupId, 'yojuego', 'group')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'Group does not exist', resp: null });
                    } else {
                        let source = objRet.resp._source;
                        let group = new Group(source.players, source.admins, source.description, source.photo, source.createdBy, source.createdOn);
                        group._id = objRet.resp._id;
                        resolve({ code: 200, message: null, resp: group });
                    }
                }, reject);
        });
    }

    getByPlayerId(playerId) {
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "group",
                "body": {
                    "query": {
                        "bool": {
                            "should": [
                                { "term": { "players": { "value": playerId } } },
                                { "term": { "admins": { "value": playerId } } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let groups = [];

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        let source = response.hits.hits[i]._source;
                        let group = new Group(source.players, source.admins, source.description, source.photo, source.createdBy, source.createdOn);
                        group._id = response.hits.hits[i]._id;

                        groups.push(group);
                    }

                    resolve({ code: 200, message: null, resp: groups });
                }
            });
        });
    }

    // getByFriendId(friendId) {
    //     return new Promise((resolve, reject) => {
    //         this.esclient.search({
    //             "index": "yojuego",
    //             "type": "friendship",
    //             "body": {
    //                 "query": {
    //                     "bool": {
    //                         "filter": [
    //                             { "term": { "friendId": friendId } }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }, (error, response) => {
    //             if (error) {
    //                 reject({ code: error.statusCode, message: error.message, resp: error });
    //             }
    //             else {
    //                 let friendships = [];

    //                 for (let i = 0; i < response.hits.hits.length; i++) {
    //                     let source = response.hits.hits[i]._source;
    //                     let friendship = new Friendship(source.playerId, source.friendId, source.status, source.info);
    //                     friendship._id = response.hits.hits[i]._id;

    //                     friendships.push(friendship);
    //                 }

    //                 resolve({ code: 200, message: null, resp: friendships });
    //             }
    //         });
    //     });
    // }

    add(group) {
        if (group instanceof Group) {
            return super.add(group, 'yojuego', 'group');
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.INVALID_INSTANCE_GROUP });
        }
    }

    update(group) {
        if (group instanceof Group) {
            let document = {
                players: group.players,
                admins: group.admins,
                description: group.description,
                photo: group.photo,
                groupCreatedBy: group.createdBy,
                groupCreatedOn: group.createdOn
            };
            return super.update(group._id, document, 'yojuego', 'group');
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.INVALID_INSTANCE_GROUP });
        }
    }

    delete(group) {
        if (group instanceof Group) {
            return super.delete(group._id, 'yojuego', 'group');
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.INVALID_INSTANCE_GROUP });
        }
    }

    static get INVALID_INSTANCE_GROUP() {
        return "Invalid group";
    }
}
module.exports = GroupESRepository;