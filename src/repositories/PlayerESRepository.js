var ESRepository = require('./ESRepository');
var Player = require('../models/Player');
var Validator = require('no-if-validator').Validator;
var InstanceOfCondition = require('no-if-validator').InstanceOfCondition;

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
        //TEST: full test require
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
            return Promise.reject({ code: 410, message: PlayerESRepository.INVALID_INSTANCE_PLAYER });
        }
    }

    update(player) {
        if (player instanceof Player) {
            return super.update(player._id, this._getDocument(player), 'yojuego', 'player');
        } else {
            return Promise.reject({ code: 410, message: PlayerESRepository.INVALID_INSTANCE_PLAYER });
        }
    }

    _mapPlayer(id, source) {
        let player = new Player(source.firstName, source.lastName, source.nickName, source.userid, source.email, source.photo, source.phone);
        player._id = id
        player.playerAudit = source.playerAudit;

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
            playerAudit: {
                createdBy: player.playerAudit.createdBy,
                createdOn: player.playerAudit.createdOn,
                createdFrom: player.playerAudit.createdFrom,
                modifiedBy: player.playerAudit.modifiedBy,
                modifiedOn: player.playerAudit.modifiedOn,
                modifiedFrom: player.playerAudit.modifiedFrom
            }
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

    static get INVALID_INSTANCE_PLAYER() {
        return 'This instance is not a player';
    }
}

module.exports = PlayerESRepository;
