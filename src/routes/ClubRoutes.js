let Validator = require('no-if-validator').Validator;
let NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var ClubRepository = require('../repositories/ClubRepository');

var repo = null;

class ClubRoutes extends Routes {
    constructor(esClient) {
        super();
        this._bodyIsNotNull = this._bodyIsNotNull.bind(this);
        this._paramsIsNotNull = this._paramsIsNotNull.bind(this);
        this._returnAll = this._returnAll.bind(this);
        this._returnFilteredClubs = this._returnFilteredClubs.bind(this);
        this._getFilters = this._getFilters.bind(this);
        this._filterClubsByDate = this._filterClubsByDate.bind(this);
        this._filterClubsByTime = this._filterClubsByTime.bind(this);

        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(esClient).throw(ClubRoutes.INVALID_ES_CLIENT));

        validator.execute(() => {
            repo = new ClubRepository(esClient);
        }, (err) => { throw err; });
    }

    _addAllRoutes(server) {
        server.get('/club/:id', this._paramsIsNotNull, this._returnClub);
        server.get('/club', this._returnAll);
        server.post('/club', this._bodyIsNotNull, this._returnFilteredClubs);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(ClubRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _paramsIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.params).throw(ClubRoutes.INVALID_PARAMS));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _returnAll(req, res, next) {
        repo.getAll()
            .then((response) => {
                res.json(200, { code: 200, message: 'OK', resp: response.resp });
            }, (cause) => {
                res.json(cause.code, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(cause.code, { code: cause.code, message: cause.message, resp: null });
            });
    }

    _returnFilteredClubs(req, res, next) {
        let filters = this._getFilters(req.body);
        repo.getBy(filters)
            .then((response) => {
                if (req.body.date)
                    this._filterClubsByDate(req.body.date);

                if (req.body.time)
                    this._filterClubsByTime(req.body.time);

                res.json(200, { code: 200, message: 'OK', resp: response.resp });
            }, (cause) => {
                res.json(cause.code, { code: cause.code, message: cause.message, resp: null });
            })
            .catch((error) => {
                res.json(cause.code, { code: cause.code, message: cause.message, resp: null });
            });
    }

    _getFilters(filters) {
        let ret = [];

        if (filters.state && filters.city) {
            ret.push({ "term": { "contactInfo.state": filters.state } });
            ret.push({ "term": { "contactInfo.city": filters.city } });
        } else if (filters.latitude && filters.longitude) {
            ret.push({ "term": { "contactInfo.latitude": filters.latitude } });
            ret.push({ "term": { "contactInfo.longitude": filters.longitude } });
        }

        if (filters.size)
            ret.push({ "term": { "field.size": filters.size } });

        if (filters.cancelingTimeForFree)
            ret.push({ "term": { "facilities.cancelingTimeForFree": filters.cancelingTimeForFree } });

        if (filters.allowOnLinePayment)
            ret.push({ "term": { "facilities.allowOnLinePayment": filters.allowOnLinePayment } });

        if (filters.allowOnLineBooking)
            ret.push({ "term": { "facilities.allowOnLineBooking": filters.allowOnLineBooking } });

        if (filters.wifi)
            ret.push({ "term": { "facilities.wifi": filters.wifi } });

        if (filters.parking)
            ret.push({ "term": { "facilities.parking": filters.parking } });

        if (filters.buffet)
            ret.push({ "term": { "facilities.buffet": filters.buffet } });

        if (filters.roofed)
            ret.push({ "term": { "facilities.roofed": filters.roofed } });

        if (filters.dressingRoom)
            ret.push({ "term": { "facilities.dressingRoom": filters.dressingRoom } });

        return ret;
    }

    _filterClubsByDate(date) {

    }

    _filterClubsByTime(time) {

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

module.exports = ClubRoutes;