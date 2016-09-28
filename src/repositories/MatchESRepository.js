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
                    let match = new Match(objRet.resp.source.tittle, new Date(objRet.resp.source.date), objRet.resp.source.fromTime, objRet.resp.source.toTime, objRet.resp.source.location, objRet.resp.source.creator, objRet.resp.source.matchType);
                    match._id = objRet.resp._id;

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
                tittle: match.tittle,
                date: match.date,
                fromTime: match.fromTime,
                toTime: match.toTime,
                location: match.location,
                creator: match.creator,
                matchType: match.matchType
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
