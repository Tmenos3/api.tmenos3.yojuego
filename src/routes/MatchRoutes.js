let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
let Routes = require('./Routes');
let Match = require('../models/Match');
let MatchRepository = require('../repositories/MatchESRepository');
let moment = require('moment');

let repoMatch = null;

class MatchRoutes extends Routes {
    constructor(esClient) {
        super();

        this._createMatch = this._createMatch.bind(this);
        this._getArrayFromString = this._getArrayFromString.bind(this);
        this._searchByUpcoming = this._searchByUpcoming.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(MatchRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repoMatch = new MatchRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.post('/match', super._bodyIsNotNull, this._createMatch, (req, res, next) => { res.json(200, { code: 200, resp: req.match, message: 'Match created' }) });
        server.get('/match/upcoming', this._searchByUpcoming, (req, res, next) => { res.json(200, { code: 200, resp: req.matches, message: null }) });
    }

    _createMatch(req, res, next) {
        try {
            var match = new Match(req.body.title, new Date(req.body.date), req.body.fromTime, req.body.toTime, req.body.location, req.player._id, req.body.matchType);
            match.pendingPlayers = this._getArrayFromString(req.body.pendingPlayers);

            repoMatch.add(match)
                .then((respMatch) => {
                    req.match = respMatch.resp;
                    next();
                }, (cause) => {
                    res.json(400, { code: 400, message: cause, resp: null });
                });
        } catch (error) {
            res.json(400, { code: 400, message: error.message, resp: error });
        }
    }

    _searchByUpcoming(req, res, next) {
        let formatDate = moment(new Date()).format('DD/MM/YYYY');
        repoMatch.getByPlayerIdAndDate(req.player._id, formatDate)
            .then((resp) => {
                req.matches = resp.resp;
                next();
            }, (cause) => {
                res.json(400, { code: 400, message: cause, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getArrayFromString(stringList) {
        return stringList ? stringList.split(";") : [];
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = MatchRoutes;