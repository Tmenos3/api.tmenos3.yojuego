var Routes = require('./Routes');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Invitation = require('../models/Invitation');
var invitationRepo = null;
var InvitationESRepository = require('../repositories/InvitationESRepository');

class InvitationRoutes extends Routes {
    constructor(esClient) {
        super();

        var validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(InvitationRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            invitationRepo = new InvitationESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/invitation/:id', (req, res, next) => { });
        server.post('/invitation/:id/accept', (req, res, next) => { });
        server.post('/invitation/:id/reject', (req, res, next) => { });
        server.post('/invitation/create',
            this._bodyIsNotNull,
            this._createInvitation,
            this._insertInvitation,
            (req, res, next) => {
                res.json(200, { return: req.return });
            });
        server.del('/invitation/:id', (req, res, next) => { });
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(InvitationRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _createInvitation(req, res, next) {
        req.invitation = new Invitation(req.body.sender,
            req.body.recipient,
            req.body.match,
            req.body.createdOn);
        next();
    }

    _insertInvitation(req, res, next) {
        invitationRepo.add(req.invitation)
            .then((invitationResp) => {
                next();
            }, (err) => {
                res.json(500, { code: 500, message: err, resp: null });
            })
            .catch((err) => {
                res.json(400, { code: 400, message: err, resp: null });
            });
    }

    static get INVALID_ES_CLIENT() {
        return 'El cliente de ElasticSearch no puede ser null ni undefined';
    }

    static get INVALID_BODY() {
        return 'Invalid request body';
    }
}

module.exports = InvitationRoutes;