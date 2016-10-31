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
                    let match = new Match(objRet.resp._source.title, new Date(objRet.resp._source.date), objRet.resp._source.fromTime, objRet.resp._source.toTime, objRet.resp._source.location, objRet.resp._source.creator, objRet.resp._source.matchType);
                    match._id = objRet.resp._id;
                    match.players = objRet.resp._source.players;
                    match.comments = objRet.resp._source.comments;
                    resolve({ code: 200, message: null, resp: match });
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
                players: match.players,
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
