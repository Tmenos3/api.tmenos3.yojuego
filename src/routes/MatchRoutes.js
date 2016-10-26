let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var Match = require('../models/Match');
var MatchRepository = require('../repositories/MatchESRepository');

var repo = null;

class MatchRoutes extends Routes {
    constructor(esClient) {
        super();

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(MatchRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new MatchRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/match/:id', (req, res, next) => { });
        server.get('/match/:id/invitations', (req, res, next) => { });
        server.post('/match/:id/addInvitation', (req, res, next) => { });
        server.post('/match/:id/removeInvitation', (req, res, next) => { });

        server.post('/match', (req, res, next) => {
            var newMatch = new Match(req.body.title,
                new Date(req.body.date),
                req.body.fromTime,
                req.body.toTime,
                req.body.location,
                req.body.creator,
                req.body.matchType);

            repo.add(newMatch)
                .then((resp) => {
                    res.json(200, resp.resp);
                }, (err) => { res.json(400, err); });
        });

        server.del('/match/:id', (req, res, next) => { });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = MatchRoutes;