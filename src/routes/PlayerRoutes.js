let ret200 = require('./returns/return200');
let ret400 = require('./returns/return400');
let ret404 = require('./returns/return404');
let ret500 = require('./returns/return500');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var Player = require('../models/Player');
var repo = null;

class PlayerRoutes extends Routes {
    constructor(esClient) {
        super();
        this._bodyIsNotNull = this._bodyIsNotNull.bind(this);
        this._paramsIsNotNull = this._paramsIsNotNull.bind(this);
        this._getPlayer = this._getPlayer.bind(this);
        this._update = this._update.bind(this);
        this._create = this._create.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(PlayerRoutes.INVALID_ES_CLIENT));
        validator.execute(() => {
            repo = new PlayerESRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/player', this._getPlayer); // revisar
        server.put('/player/create', this._bodyIsNotNull, this._create);
        server.post('/player/:id/update', this._paramsIsNotNull, this._bodyIsNotNull, this._update);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(PlayerRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err, resp: null }); });
    }

    _paramsIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.params).throw(PlayerRoutes.INVALID_PARAMS));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _create(req, res, next) {
        repo.getByUserId(req.user.id)
            .then((ret) => {
                if (ret.resp) {
                    res.json(400, { code: 400, message: 'Player already exists', resp: null });
                } else {
                    try {
                        let player = new Player(req.body.firstName, req.body.lastName, req.body.nickName, req.user.id);
                        return repo.add(player);
                    } catch (error) {
                        res.json(400, { code: 400, message: error.message, resp: error });
                    }
                }
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .then((resp) => {
                res.json(200, { code: 200, message: 'Player created.', resp: resp.resp });
            }, (err) => {
                res.json(400, { code: 400, message: err, resp: null });
            })
            .catch((err) => {
                res.json(500, { code: 500, message: err, resp: null });
            });
    }

    _getPlayer(req, res, next) {
        repo.getByUserId(req.user.id)
            .then((resp) => {
                if (!resp.resp) {
                    res.json(404, { code: 404, message: 'Player inexistente', resp: null });
                } else {
                    res.json(200, { code: 200, message: 'OK', resp: resp.resp });
                }
            }, (cause) => { res.json(404, { code: 404, message: cause, resp: null }); })
            .catch((err) => { res.json(500, { code: 500, message: err, resp: null }); });
    }

    _update(req, res, next) {
        repo.get(req.params.id)
            .then((ret) => {
                if (!ret.resp) {
                    res.json(400, { code: 400, message: 'Playes does not exist', resp: null });
                } else if (ret.resp.userid != req.user.id) {
                    //Algo raro esta pasando, no coinciden el userid del player con el del token
                    res.json(400, { code: 500, message: 'Diference between user and player', resp: null });
                } else {
                    let player = ret.resp;
                    player.firstName = req.body.firstName;
                    player.lastName = req.body.lastName;
                    player.nickname = req.body.nickname;
                    return repo.update(player);
                }
            }, (err) => { res.json(400, { code: 400, message: err, resp: null }); })
            .then((resp) => {
                res.json(200, { code: 200, message: 'Profile saved.', resp: resp.resp });
            }, (err) => { res.json(400, { code: 400, message: err, resp: null }); })
            .catch((err) => { res.json(500, { code: 500, message: err, resp: null }); });
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

module.exports = PlayerRoutes;