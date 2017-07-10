let ESRepository = require('../common/ESRepository');
let Player = require('../models/Player');
let Validator = require('no-if-validator').Validator;
let InstanceOfCondition = require('no-if-validator').InstanceOfCondition;

class PlayerESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapPlayer = this._mapPlayer.bind(this);
        this._getDocument = this._getDocument.bind(this);
        this._getQueryByUserId = this._getQueryByUserId.bind(this);
        this._getQueryByEmail = this._getQueryByEmail.bind(this);
    }

    get(playerId) {
        return super.get(playerId, 'yojuego', 'player')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Player does not exist', resp: null };
                } else {
                    let player = this._mapPlayer(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: player };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByUserId(userid) {
        if (!userid) return Promise.reject({ code: 410, message: PlayerESRepository.ERRORS.INVALID_USERID, resp: null });

        return super.getBy(this._getQueryByUserId(userid), 'yojuego', 'player')
            .then((objRet) => {
                if (objRet.resp.length < 1) {
                    return { code: 404, message: null, resp: null };
                } else {
                    let player = this._mapPlayer(objRet.resp[0]._id, objRet.resp[0]._source);
                    return { code: 200, message: null, resp: player };
                }
            }, (error) => {
                return Promise.reject(error);
            });
    }

    getByEmail(email) {
        if (!email) return Promise.reject({ code: 410, message: PlayerESRepository.ERRORS.INVALID_EMAIL, resp: null });

        return super.getBy(this._getQueryByEmail(email), 'yojuego', 'player')
            .then((objRet) => {
                if (objRet.resp.length < 1) {
                    return { code: 404, message: null, resp: null };
                } else {
                    let player = this._mapPlayer(objRet.resp[0]._id, objRet.resp[0]._source);
                    return { code: 200, message: null, resp: player };
                }
            }, (error) => { return Promise.reject(error); });
    }

    add(player) {
        if (player instanceof Player) {
            return super.add(player, 'yojuego', 'player');
        } else {
            return Promise.reject({ code: 410, message: PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER });
        }
    }

    update(player) {
        if (player instanceof Player) {
            return super.update(player._id, this._getDocument(player), 'yojuego', 'player');
        } else {
            return Promise.reject({ code: 410, message: PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER });
        }
    }

    delete(player) {
        if (player instanceof Player) {
            return super.delete(player._id, 'yojuego', 'player');
        } else {
            return Promise.reject({ code: 410, message: PlayerESRepository.ERRORS.INVALID_INSTANCE_PLAYER });
        }
    }

    _mapPlayer(id, source) {
        let player = new Player(source.firstName, source.lastName, source.nickName, source.userid, source.email, source.photo, source.phone);
        player._id = id
        player.auditInfo = source.auditInfo;

        return player;
    }

    _getDocument(player) {
        let document = {
            firstName: player.firstName,
            lastName: player.lastName,
            nickName: player.nickName,
            email: player.email,
            photo: player.photo,
            phone: player.phone,
            userid: player.userid,
            auditInfo: player.auditInfo
        };

        return document;
    }

    _getQueryByEmail(email) {
        return {
            "bool": {
                "filter": [
                    { "term": { "email": email } }
                ]
            }
        };
    }

    _getQueryByUserId(userid) {
        return {
            "bool": {
                "filter": [
                    { "term": { "userid": userid } }
                ]
            }
        };
    }

    static get ERRORS() {
        let errors = ESRepository.ERRORS;
        errors.INVALID_INSTANCE_PLAYER = 'This instance is not a player';
        errors.INVALID_USERID = 'El user id no puede ser null ni undefined';
        errors.INVALID_EMAIL = 'El email no puede ser null ni undefined';
        return errors;
    }
}

module.exports = PlayerESRepository;
