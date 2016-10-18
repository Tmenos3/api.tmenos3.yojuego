var Routes = require('./Routes');
var Match = require('../models/Match');
var MatchRepository = require('../repositories/MatchESRepository');
var es = require('elasticsearch');
var config = require('config');

var client = new es.Client({
    host: config.get('dbConfig').database,
    log: 'info'
});

var repo = new MatchRepository(client);

class MatchRoutes extends Routes {
    constructor() {
        super();
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
}

module.exports = MatchRoutes;