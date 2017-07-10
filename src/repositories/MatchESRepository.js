let ESRepository = require('../common/ESRepository');
let Match = require('../models/Match');

class MatchESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._getQueryByPlayerIdAndDate = this._getQueryByPlayerIdAndDate.bind(this);
        this._map = this._map.bind(this);
        this._getDocument = this._getDocument.bind(this);
    }

    get(matchId) {
        return super.get(matchId, 'yojuego', 'match')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Match does not exist', resp: null };
                } else {
                    let match = this._map(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: match };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByPlayerIdAndDate(playerId, date) {
        if (!playerId) return Promise.reject({ code: 410, message: MatchESRepository.ERRORS.INVALID_PLAYERID, resp: null })
        if (!date) return Promise.reject({ code: 410, message: MatchESRepository.ERRORS.INVALID_DATE, resp: null })

        return super.getBy(this._getQueryByPlayerIdAndDate(playerId, date), 'yojuego', 'match')
            .then((objRet) => {
                let matches = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let match = this._map(objRet.resp[i]._id, objRet.resp[i]._source);
                    matches.push(match);
                }

                return { code: 200, message: null, resp: matches };

            }, (error) => { return Promise.reject(error); });
    }

    add(match) {
        if (match instanceof Match) {
            return super.add(match, 'yojuego', 'match')
                .then((resp) => {
                    let newMatch = this._map(resp.resp._id, match);
                    return { code: 200, message: MatchESRepository.MESSAGES.DOCUMENT_INSERTED, resp: newMatch };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH });
        }
    }

    update(match) {
        if (match instanceof Match) {
            let document = this._getDocument(match);
            return super.update(match._id, document, 'yojuego', 'match')
                .then((resp) => {
                    return { code: 200, message: MatchESRepository.MESSAGES.DOCUMENT_UPDATED, resp: match };
                }, (error) => { return Promise.reject(error); });
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH });
        }
    }

    delete(match) {
        if (match instanceof Match) {
            let document = this._getDocument(match);
            return super.delete(match._id, 'yojuego', 'match');
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.ERRORS.INVALID_INSTANCE_MATCH });
        }
    }

    _getDocument(match) {
        let document = {
            title: match.title,
            date: match.date,
            fromTime: match.fromTime,
            toTime: match.toTime,
            location: match.location,
            creator: match.creator,
            matchType: match.matchType,
            status: match.status,
            pendingPlayers: match.pendingPlayers,
            confirmedPlayers: match.confirmedPlayers,
            canceledPlayers: match.canceledPlayers,
            comments: match.comments,
            auditInfo: match.auditInfo
        };

        return document;
    }

    _getQueryByPlayerIdAndDate(playerId, date) {
        return {
            "bool": {
                "should": [
                    { "term": { "confirmedPlayers": { "value": playerId } } },
                    { "term": { "pendingPlayers": { "value": playerId } } },
                    { "term": { "canceledPlayers": { "value": playerId } } },
                    { "term": { "creator": { "value": playerId } } }
                ],
                "must": [
                    { "range": { "date": { "gte": date, "format": "dd/MM/yyyy" } } }
                ],
                "minimum_should_match": 1
            }
        };
    }

    _map(id, source) {
        let match = new Match(source.title, new Date(source.date), source.fromTime, source.toTime, source.location, source.creator, source.matchType, null, source.matchAudit, source.status);
        match._id = id;
        match.confirmedPlayers = source.confirmedPlayers;
        match.pendingPlayers = source.pendingPlayers;
        match.canceledPlayers = source.canceledPlayers;

        return match;
    }

    static get ERRORS() {
        let errors = ESRepository.ERRORS;
        errors.INVALID_INSTANCE_MATCH = 'This instance is not a match.';
        errors.INVALID_PLAYERID = 'El playerid no puede ser null ni undefined.';
        errors.INVALID_DATE = 'El date no puede ser null ni undefined.';
        return errors;
    }
}

module.exports = MatchESRepository;
