var ESRepository = require('./ESRepository');
var Match = require('../models/Match');

class MatchESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(matchId) {
        return new Promise((resolve, reject) => {
            super.get(matchId, 'yojuego', 'match')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'Match does not exist', resp: null });
                    } else {
                        var match = new Match(objRet.resp._source.title, new Date(objRet.resp._source.date), objRet.resp._source.fromTime, objRet.resp._source.toTime, objRet.resp._source.location, objRet.resp._source.creator, objRet.resp._source.matchType);
                        match._id = objRet.resp._id;
                        match.confirmedPlayers = objRet.resp._source.confirmedPlayers;
                        match.pendingPlayers = objRet.resp._source.pendingPlayers;
                        resolve({ code: 200, message: null, resp: match });
                    }
                }, reject);
        });
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
                comments: match.comments
            };
            return super.update(match._id, document, 'yojuego', 'match');
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.INVALID_INSTANCE_PLAYER });
        }
    }

    static get INVALID_MATCH() {
        return "Invalid match";
    }
}

module.exports = MatchESRepository;
