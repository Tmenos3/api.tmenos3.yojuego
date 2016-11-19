let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
// var Match = require('../models/Match');
var StadiumRepository = require('../repositories/StadiumRepository');

var repo = null;

class StadiumRoutes extends Routes {
    constructor(esClient) {
        super();
        this._bodyIsNotNull = this._bodyIsNotNull.bind(this);
        this._paramsIsNotNull = this._paramsIsNotNull.bind(this);
        this._returnAll = this._returnAll.bind(this);
        this._filterStadiums = this._filterStadiums.bind(this);
        this._returnStadium = this._returnStadium.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(StadiumRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new StadiumRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/stadium/:id', this._paramsIsNotNull, this._returnStadium);
        server.get('/stadium', this._returnAll);
        server.post('/stadium', this._bodyIsNotNull, this._filterStadiums, this._returnStadium);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(StadiumRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _paramsIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.params).throw(StadiumRoutes.INVALID_PARAMS));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _returnAll(req, res, next) {
        //TODO
        res.json(200, { code: 200, message: 'OK', resp: [] });
    }

    _returnStadium(req, res, next) {
        //TODO
        res.json(200, { code: 200, message: 'OK', resp: req.stadium });
    }

    _filterStadiums(req, res, next) {
        //TODO
        // {
        //     ubicacion: {
        //         tipo: 1,
        //         provincia: '1',
        //         localidad: '1',
        //         tipo: 2,
        //         latitud: '-40.1234',
        //         longitud: '40.323423'
        //     },
        //     tipoCancha: 5,
        //     aceptaReserva: true,
        //     aceptaPagoOnLine: true,
        //     duchas: true,
        //     techada: true,
        //     buffet: true,
        //     fechaHora: '2016-11-17T19:00:00Z'
        // }
        res.json(200, { code: 200, message: 'OK', resp: req.match });
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

module.exports = StadiumRoutes;