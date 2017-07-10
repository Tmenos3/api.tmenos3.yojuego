let ESRepository = require('../common/ESRepository');
let Group = require('../models/Group');

class GroupESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._map = this._map.bind(this);
        this._getQueryByPlayerId = this._getQueryByPlayerId.bind(this);
    }

    get(groupId) {
        return super.get(groupId, 'yojuego', 'group')
            .then((objRet) => {
                if (objRet.code === 200 && !objRet.resp) {
                    return { code: 200, message: 'Group does not exist', resp: null };
                } else {
                    let group = this._map(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: group };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByPlayerId(playerId) {
        if (!playerId) return Promise.reject({ code: 410, message: GroupESRepository.ERRORS.INVALID_PLAYERID, resp: null })

        return super.getBy(this._getQueryByPlayerId(playerId), 'yojuego', 'group')
            .then((objRet) => {
                let groups = [];

                groups = objRet.resp.map(g => {
                    return this._map(g._id, g._source);
                });

                return { code: 200, message: null, resp: groups };
            }, (error) => { return Promise.reject(error); });
    }

    add(group) {
        if (group instanceof Group) {
            return super.add(group, 'yojuego', 'group')
                .then((resp) => {
                    let newGroup = this._map(resp.resp._id, group);
                    return { code: 200, message: GroupESRepository.MESSAGES.DOCUMENT_INSERTED, resp: newGroup };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP });
        }
    }

    update(group) {
        if (group instanceof Group) {
            let document = {
                players: group.players,
                admins: group.admins,
                description: group.description,
                photo: group.photo,
                messages: group.messages,
                auditInfo: group.auditInfo
            };
            return super.update(group._id, document, 'yojuego', 'group')
                .then((resp) => {
                    let newGroup = this._map(resp.resp._id, group);
                    return { code: 200, message: GroupESRepository.MESSAGES.DOCUMENT_UPDATED, resp: newGroup };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP });
        }
    }

    delete(group) {
        if (group instanceof Group) {
            return super.delete(group._id, 'yojuego', 'group');
        } else {
            return Promise.reject({ code: 410, message: GroupESRepository.ERRORS.INVALID_INSTANCE_GROUP });
        }
    }

    _map(id, source) {
        let group = new Group(source.players, source.admins, source.description, source.photo, source.messages);
        group._id = id;
        group.auditInfo = source.auditInfo

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

    static get ERRORS() {
        let errors = ESRepository.ERRORS;
        errors.INVALID_INSTANCE_GROUP = 'This instance is not a group.';
        errors.INVALID_PLAYERID = 'El player id no puede ser null ni undefined.';
        return errors;
    }
}
module.exports = GroupESRepository;