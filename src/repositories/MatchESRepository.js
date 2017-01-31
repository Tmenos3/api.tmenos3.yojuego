let ESRepository = require('./ESRepository');
let Match = require('../models/Match');

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
                        let match = new Match(objRet.resp._source.title, new Date(objRet.resp._source.date), objRet.resp._source.fromTime, objRet.resp._source.toTime, objRet.resp._source.location, objRet.resp._source.creator, objRet.resp._source.matchType);
                        match._id = objRet.resp._id;
                        match.confirmedPlayers = objRet.resp._source.confirmedPlayers;
                        match.pendingPlayers = objRet.resp._source.pendingPlayers;
                        resolve({ code: 200, message: null, resp: match });
                    }
                }, reject);
        });
    }

    // getByPlayerId(playerId) {
    //     return new Promise((resolve, reject) => {
    //         this.esclient.search({
    //             "index": "yojuego",
    //             "type": "match",
    //             "body": {
    //                 "query": {
    //                     "bool": {
    //                         "should": [
    //                             { "term": { "confirmedPlayers": { "value": playerId } } },
    //                             { "term": { "pendingPlayers": { "value": playerId } } },
    //                             { "term": { "creator": { "value": playerId } } }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }, (error, response) => {
    //             if (error) {
    //                 reject({ code: error.statusCode, message: error.message, resp: error });
    //             }
    //             else {
    //                 let matches = [];

    //                 for (let i = 0; i < response.hits.hits.length; i++) {
    //                     let source = response.hits.hits[i]._source;
    //                     let match = new Match(source.title, new Date(source.date), source.fromTime, source.toTime, source.location, source.creator, source.matchType);
    //                     match._id = response.hits.hits[i]._id;
    //                     match.confirmedPlayers = source.confirmedPlayers;
    //                     match.pendingPlayers = source.pendingPlayers;

    //                     matches.push(match);
    //                 }

    //                 resolve({ code: 200, message: null, resp: matches });
    //             }
    //         });
    //     });
    // }

    getByPlayerIdAndDate(playerId, date) {
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "match",
                "body": {
                    "query": {
                        "bool": {
                            "should": [
                                { "term": { "confirmedPlayers": { "value": playerId } } },
                                { "term": { "pendingPlayers": { "value": playerId } } },
                                { "term": { "creator": { "value": playerId } } }
                            ],
                            "must": [
                                { "range": { "date": { "gte": date, "format": "dd/MM/yyyy" } } }
                            ],
                            "minimum_should_match" : 1
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let matches = [];

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        let source = response.hits.hits[i]._source;
                        let match = new Match(source.title, new Date(source.date), source.fromTime, source.toTime, source.location, source.creator, source.matchType);
                        match._id = response.hits.hits[i]._id;
                        match.confirmedPlayers = source.confirmedPlayers;
                        match.pendingPlayers = source.pendingPlayers;

                        matches.push(match);
                    }

                    resolve({ code: 200, message: null, resp: matches });
                }
            });
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
