let ESRepository = require('../../repositories/ESRepository');
let MatchInvitation = require('../models/MatchInvitation');

class MatchInvitationESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._map = this._map.bind(this);
        this._getDocument = this._getDocument.bind(this);
        this._getQueryByPendingAndPlayerId = this._getQueryByPendingAndPlayerId.bind(this);
    }

    get(matchInvitationId) {
        return super.get(matchInvitationId, 'yojuego', 'matchInvitation')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'MatchInvitation does not exist', resp: null };
                } else {
                    let matchInvitation = this._map(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: matchInvitation };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getPendingByPlayerId(playerId) {
        //TEST: not null, not undefined
        //TEST: instance of string both
        return super.getBy(this._getQueryByPendingAndPlayerId(playerId), 'yojuego', 'matchInvitation')
            .then((objRet) => {
                let ret = [];
                for (let i = 0; i < objRet.resp.length; i++) {
                    let elem = this._map(objRet.resp[i]._id, objRet.resp[i]._source);
                    ret.push(elem);
                }
                return { code: 200, message: null, resp: ret };
            }, (error) => { return Promise.reject(error); });
    }

    add(matchInvitation) {
        //TEST: not null, not undefined
        //TEST: instance of MatchInvitation
        //TEST: return a matchInvitation
        if (matchInvitation instanceof MatchInvitation) {
            return super.add(matchInvitation, 'yojuego', 'matchInvitation')
                .then((resp) => {
                    let newMatchInvitation = this._map(resp.resp._id, matchInvitation);
                    return { code: 200, message: MatchInvitationESRepository.DOCUMENT_INSERTED, resp: newMatchInvitation };
                }, reject)
        } else {
            return Promise.reject({ code: 410, message: MatchInvitationESRepository.INVALID_INSTANCE });
        }
    }

    update(matchInvitation) {
        //TEST: not null, not undefined
        //TEST: instance of matchInvitation
        if (matchInvitation instanceof MatchInvitation) {
            return super.update(matchInvitation._id, this._getDocument(matchInvitation), 'yojuego', 'matchInvitation');
        } else {
            return Promise.reject({ code: 410, message: MatchInvitationESRepository.INVALID_INSTANCE });
        }
    }

    delete(matchInvitation) {
        //TEST: not null, not undefined
        //TEST: instance of matchInvitation
        if (matchInvitation instanceof MatchInvitation) {
            return super.delete(matchInvitation._id, 'yojuego', 'matchInvitation');
        } else {
            return Promise.reject({ code: 410, message: MatchInvitationESRepository.INVALID_INSTANCE, resp: null });
        }
    }

    addBulk(matchInvitationList) {
        //TEST: not null, not undefined
        //TEST: instance of MatchInvitation
        //TEST: return a matchInvitation
        let body = this._getBulkBody(matchInvitationList);
        return new Promise((resolve, reject) => {
            if (!matchInvitationList || !matchInvitationList.length)
                return resolve({ code: 400, message: 'Invitation list is empty', resp: null });
            else {
                this.esclient.bulk({ body: body }, (err, resp) => {
                    if (err) {
                        reject({ code: err.status, message: err.message, resp: err });
                    }
                    else {
                        resolve({ code: 200, message: null, resp: resp });
                    }
                });
            }
        });
    }

    _map(id, source) {
        let matchInvitation = new MatchInvitation(source.matchId, source.playerId, source.senderId, source.status, source.sendedOn);
        matchInvitation._id = id
        matchInvitation.matchInvitationAudit = source.matchInvitationAudit;

        return matchInvitation;
    }

    _getDocument(matchInvitation) {
        let document = {
            matchId: matchInvitation.matchId,
            playerId: matchInvitation.playerId,
            senderId: matchInvitation.senderId,
            status: matchInvitation.status,
            sendedOn: matchInvitation.sendedOn,
            matchInvitationAudit: {
                createdBy: matchInvitation.matchInvitationAudit.createdBy,
                createdOn: matchInvitation.matchInvitationAudit.createdOn,
                createdFrom: matchInvitation.matchInvitationAudit.createdFrom,
                modifiedBy: matchInvitation.matchInvitationAudit.modifiedBy,
                modifiedOn: matchInvitation.matchInvitationAudit.modifiedOn,
                modifiedFrom: matchInvitation.matchInvitationAudit.modifiedFrom
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

    _getBulkBody(array) {
        let ret = [];

        for (let i = 0; i < array.length; i++) {
            ret.push({ 'index': { '_index': 'yojuego', '_type': 'matchInvitation' } });
            ret.push(array[i]);
        }

        return ret;
    }

    static get INVALID_MATCH_INVITATION() {
        return "Invalid Match Invitation";
    }

    static get INVALID_INSTANCE() {
        return 'This instance is not a MatchInvitation';
    }
}

module.exports = MatchInvitationESRepository;