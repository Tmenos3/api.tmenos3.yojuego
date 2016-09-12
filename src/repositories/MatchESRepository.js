var ESRepository = require('./ESRepository');
var Match = require('../models/Match');

class MatchESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    getById(matchId) {
        return new Promise((resolve, reject) => {
            super.getById(matchId, 'yojuego', 'match')
                .then((objRet) => {
                    var match = new Match(objRet.source.tittle, objRet.source.date, objRet.source.fromTime, objRet.source.toTime, objRet.source.location, objRet.source.creator, objRet.source.matchType);
                    match.id = objRet._id;
                    match.createdOn = objRet.source.createdOn;
                    
                    resolve(match);
                }, reject);
        });
    }

    getBy(criteria) {
        return new Promise((resolve, reject) => {
            super.getBy(criteria, 'yojuego', 'match')
                .then((list) => {
                    let ret = [];

                    for (let i = 0; i < list.length; i++) {
                        let match = new Match(list[i]._source.tittle, list[i]._source.date, list[i]._source.fromTime, list[i]._source.toTime, list[i]._source.location, list[i]._source.creator, list[i]._source.matchType);
                        match.id = list[i]._id;
                        match.createdOn = list[i]._source.createdOn;
                        ret.push(match);
                    }

                    resolve(ret);
                }, reject);
        });
    }

    add(match) {
        return new Promise((resolve, reject) => {
            super.add(match, 'yojuego', 'match')
                .then(resolve, reject);
        });
    }

    static get INVALID_MATCH() {
        return "Invalid match";
    }
}

module.exports = MatchESRepository;
