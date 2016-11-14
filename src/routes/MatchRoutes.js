let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var Match = require('../models/Match');
var MatchRepository = require('../repositories/MatchESRepository');

var repo = null;

class MatchRoutes extends Routes {
    constructor(esClient) {
        super();
        this._bodyIsNotNull = this._bodyIsNotNull.bind(this);
        this._paramsIsNotNull = this._paramsIsNotNull.bind(this);
        this._getMatch = this._getMatch.bind(this);
        this._addComment = this._addComment.bind(this);
        this._deleteComment = this._deleteComment.bind(this);
        this._updateComment = this._updateComment.bind(this);
        this._returnComments = this._returnComments.bind(this);
        this._returnPlayers = this._returnPlayers.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(MatchRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new MatchRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/match/:id', this._paramsIsNotNull, this._getMatch, this._returnMatch);
        server.get('/match/:id/players', this._paramsIsNotNull, this._getMatch, this._returnPlayers);
        server.get('/match/:id/comment', this._paramsIsNotNull, this._getMatch, this._returnComments);
        server.post('/match/:id/comment', this._paramsIsNotNull, this._bodyIsNotNull, this._getMatch, this._addComment);
        server.put('/match/:id/comment/:commentid', this._paramsIsNotNull, this._bodyIsNotNull, this._getMatch, this._updateComment);
        server.del('/match/:id/comment/:commentid', this._paramsIsNotNull, this._getMatch, this._deleteComment);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(MatchRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _returnComments(req, res, next) {
        res.json(200, { code: 200, message: 'OK', resp: req.match.comments });
    }

    _returnPlayers(req, res, next) {
        res.json(200, { code: 200, message: 'OK', resp: req.match.players });
    }

    _returnMatch(req, res, next) {
        res.json(200, { code: 200, message: 'OK', resp: req.match });
    }

    _paramsIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.params).throw(MatchRoutes.INVALID_PARAMS));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _getMatch(req, res, next) {
        repo.get(req.params.id)
            .then((response) => {
                if (!response.resp) {
                    res.json(401, { code: 401, message: 'Invalid match', resp: null });
                } else {
                    req.match = response.resp;
                    next();
                }
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _addComment(req, res, next) {
        req.match.addComment(req.body.owner, req.body.text, new Date());
        repo.update(req.match)
            .then((response) => {
                res.json(200, { code: 200, message: 'Comment added successfuly', resp: req.match });
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _deleteComment(req, res, next) {
        req.match.removeComment(req.params.commentid);
        repo.update(req.match)
            .then((response) => {
                res.json(200, { code: 200, message: 'Comment deleted successfuly', resp: req.match });
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    _updateComment(req, res, next) {
        req.match.updateComment(req.params.commentid, req.body.newText);
        repo.update(req.match)
            .then((response) => {
                res.json(200, { code: 200, message: 'Comment updated successfuly', resp: req.match });
            }, (err) => res.json(400, { code: 400, message: err.message, resp: null }))
            .catch((err) => res.json(500, { code: 500, message: err.message, resp: null }));
    }

    static get INVALID_BODY() {
        return 'Invalid request body';
    }

    static get INVALID_PARAMS() {
        return 'Invalid request params';
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }
}

module.exports = MatchRoutes;