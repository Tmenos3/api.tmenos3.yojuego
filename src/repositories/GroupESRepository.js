let ESRepository = require('./ESRepository');
let Group = require('../models/Group');

class GroupESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapGroup = this._mapGroup.bind(this);
        this._getQueryByPlayerId = this._getQueryByPlayerId.bind(this);
    }

    get(groupId) {
        return super.get(groupId, 'yojuego', 'group')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Group does not exist', resp: null };
                } else {
                    let group = this._mapGroup(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: group };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByPlayerId(playerId) {
        return super.getBy(this._getQueryByPlayerId(playerId), 'yojuego', 'group')
            .then((objRet) => {
                let groups = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let group = this._mapGroup(objRet.resp[i]._id, objRet.resp[i]._source);
                    groups.push(group);
                }

                return { code: 200, message: null, resp: groups };
            }, (error) => { return Promise.reject(error); });
    }

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

    _mapGroup(id, source) {
        let group = new Group(source.players, source.admins, source.description, source.photo, source.createdBy, source.createdOn);
        group._id = id;

        return group;
    }

    _getQueryByPlayerId(playerId) {
        return {
            "bool": {
                "should": [
                    { "term": { "players": { "value": playerId } } },
                    { "term": { "admins": { "value": playerId } } }
                ]
            }
        };
    }

    static get INVALID_INSTANCE_GROUP() {
        return "Invalid group";
    }
}
module.exports = GroupESRepository;