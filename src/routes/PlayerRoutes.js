let ret200 = require('./returns/return200');
let ret400 = require('./returns/return400');
let ret404 = require('./returns/return404');
let ret500 = require('./returns/return500');
var Validator = require('no-if-validator').Validator;
var NotNullOrUndefinedCondition = require('no-if-validator').NotNullOrUndefinedCondition;
var Routes = require('./Routes');
var config = require('../../config');
var PlayerESRepository = require('../repositories/PlayerESRepository');
var Player = require('../models/Player');
var es = require('elasticsearch');
var client = new es.Client({
    host: config.database,
    log: 'info'
});
var repo = new PlayerESRepository(client);

class PlayerRoutes extends Routes {
    constructor() {
        super();
    }

    _addAllRoutes(server) {
        server.get('/player', this._getPlayer);
        server.get('/player/:id/upcomingMatches', (req, res, next) => { });
        server.post('/player/create', (req, res, next) => { });
        server.post('/player/:id/update', (req, res, next) => { });
        server.del('/player/:id', (req, res, next) => { });
        server.post('/player/profile', this._bodyIsNotNull, this._updateProfile);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(PlayerRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    _getPlayer(req, res, next) {
        repo.getByUserId(req.user)
            .then((resp) => {
                if (!resp.resp) {
                    ret404(res, 'Player inexistente', null);
                } else {
                    ret200(res, null, resp.resp);
                }
            }, (err) => { ret400(res, err, null); })
            .catch((err) => { ret500(res, err, null); });
    }

    _updateProfile(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.nickname).throw(PlayerRoutes.INVALID_NICKNAME));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.birthday).throw(PlayerRoutes.INVALID_BIRTHDAY));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.state).throw(PlayerRoutes.INVALID_STATE));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.adminState).throw(PlayerRoutes.INVALID_ADMINSTATE));

        validator.execute(() => {
            repo.getByUserId(req.user)
                .then((ret) => {
                    let player = null;
                    if (ret.resp) {
                        player = ret.resp;
                        player.nickName = req.body.nickname;
                        player.birthday = new Date(req.body.birthday);
                        player.state = req.body.state;
                        player.adminState = req.body.adminState;
                        return repo.update(player);
                    } else {
                        player = new Player(req.body.nickname, new Date(req.body.birthday), req.body.state, req.body.adminState, req.user);
                        return repo.add(player);
                    }
                }, (err) => { res.json(400, { code: 400, message: err, resp: null }); })
                .then((resp) => {
                    res.json(200, { code: 200, message: 'Profile saved.', resp: resp.resp });
                    next();
                }, (err) => { res.json(400, { code: 400, message: err, resp: null }); })
                .catch((err) => { res.json(500, { code: 500, message: err, resp: null }); });
        }, (err) => { res.json(400, { code: 400, message: err.message, resp: null }); });
    }

    /*
        upcomingMatches:
            ElasticSearch no tiene "join relacionales", motivo por el cual hay que definir como los vamos a relacionar
            En principio, la relacion entre partidos y jugadores es a travez de invitaciones aceptadas, entonces surgen
            los siguientes criterios de busqueda:
                Entrando por invitacion: 
                    1- Busco todas las invitaciones aceptadas del jugador para obtener los id de partido.
                    2- Del universo de partidos anterior, separo todos aquellos con fecha mayor igual a hoy
                       que todavía no completan la cantidad de jugadores necesaria
                Entrando por partido:
                    1- Busco todos los partidos con fecha mayor igual a hoy y que todavía no completan la cantidad
                       de jugadores necesaria.
                    2- Busco todas las invitaciones aceptadas por el jugador correspondientes a los partidos del
                       universo anterior

            ref: https://www.elastic.co/guide/en/elasticsearch/guide/current/application-joins.html
    */

    static get INVALID_BODY() {
        return 'Invalid request body';
    }

    static get INVALID_NICKNAME() {
        return 'Invalid nickname';
    }

    static get INVALID_BIRTHDAY() {
        return 'Invalid birthday';
    }

    static get INVALID_STATE() {
        return 'Invalid state';
    }

    static get INVALID_ADMINSTATE() {
        return 'Invalid admin state';
    }
}

module.exports = PlayerRoutes;