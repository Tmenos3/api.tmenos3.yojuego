let ESRepository = require('./ESRepository');
let Match = require('../models/Match');

class MatchESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._getQueryByPlayerIdAndDate = this._getQueryByPlayerIdAndDate.bind(this);
        this._mapMatch = this._mapMatch.bind(this);
        this._getDocument = this._getDocument.bind(this);
    }

    get(matchId) {
        return super.get(matchId, 'yojuego', 'match')
            .then((objRet) => {
                if (objRet.code == 404) {
                    return { code: 404, message: 'Match does not exist', resp: null };
                } else {
                    let match = this._mapMatch(objRet.resp._id, objRet.resp._source);
                    return { code: 200, message: null, resp: match };
                }
            }, (error) => { return Promise.reject(error); });
    }

    getByPlayerIdAndDate(playerId, date) {
        //TEST: full test require
        return super.getBy(this._getQueryByPlayerIdAndDate(playerId, date), 'yojuego', 'match')
            .then((objRet) => {
                let matches = [];

                for (let i = 0; i < objRet.resp.length; i++) {
                    let match = this._mapMatch(objRet.resp[i]._id, objRet.resp[i]._source);
                    matches.push(match);
                }

                return { code: 200, message: null, resp: matches };

            }, (error) => { return Promise.reject(error); });
    }

    add(match) {
        if (match instanceof Match) {
            return super.add(match, 'yojuego', 'match');
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.INVALID_INSTANCE_PLAYER });
        }
    }

    update(match) {
        if (match instanceof Match) {
            let document = this._getDocument(match);
            return super.update(match._id, document, 'yojuego', 'match');
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.INVALID_INSTANCE_PLAYER });
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
            pendingPlayers: match.pendingPlayers,
            confirmedPlayers: match.confirmedPlayers,
            comments: match.comments,
            matchAudit: {
                createdBy: match.matchAudit.createdBy,
                createdOn: match.matchAudit.createdOn,
                createdFrom: match.matchAudit.createdFrom,
                modifiedBy: match.matchAudit.modifiedBy,
                modifiedOn: match.matchAudit.modifiedOn,
                modifiedFrom: match.matchAudit.modifiedFrom
            }
        };

        return document;
    }

    _getQueryByPlayerIdAndDate(playerId, date) {
        return {
            "bool": {
                "should": [
                    { "term": { "confirmedPlayers": { "value": playerId } } },
                    { "term": { "pendingPlayers": { "value": playerId } } },
                    { "term": { "creator": { "value": playerId } } }
                ],
                "must": [
                    { "range": { "date": { "gte": date, "format": "dd/MM/yyyy" } } }
                ],
                "minimum_should_match": 1
            }
        };
    }

    _mapMatch(id, source) {
        let match = new Match(source.title, new Date(source.date), source.fromTime, source.toTime, source.location, source.creator, source.matchType);
        match._id = id;
        match.confirmedPlayers = source.confirmedPlayers;
        match.pendingPlayers = source.pendingPlayers;

        return match;
    }

    static get INVALID_MATCH() {
        return "Invalid match";
    }
}

module.exports = MatchESRepository;
