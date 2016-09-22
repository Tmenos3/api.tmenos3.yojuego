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

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 1, message: err.message }); });
    }

    _getPlayer(req, res, next) {
        repo.getByUserId(req.user)
            .then((resp) => {
                if (!resp.resp) {
                    res.json(404, {code: 404, message: 'Player inexistente'});
                } else {
                    res.json(200, {code: 404, message: 'Player inexistente', resp: resp.resp});
                }
            }, (err) => { res.json(400, { code: 400, message: err }); })
            .catch((err) => { res.json(500, { code: 500, message: err }); });
    }

    _updateProfile(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.nickname).throw(PlayerRoutes.INVALID_NICKNAME));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.birthday).throw(PlayerRoutes.INVALID_BIRTHDAY));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.state).throw(PlayerRoutes.INVALID_STATE));
        validator.addCondition(new NotNullOrUndefinedCondition(req.body.adminState).throw(PlayerRoutes.INVALID_ADMINSTATE));

        validator.execute(() => { this._doAfterValidateProfileInfo(req.parems.userid, req.body, res) }, (err) => { res.json(400, { code: 1, message: err.message }); });
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

    _doAfterValidateProfileInfo(userid, profile, res) {
        repo.getbyUserId(userid)
            .then((playerReturned) => {
                if (playerReturned) {
                    playerReturned.nickName = profile.nickName;
                    playerReturned.birthday = new Date(profile.birthday);
                    playerReturned.state = profile.state;
                    playerReturned.adminState = profile.adminState;
                    return repo.update(playerReturned);
                } else {
                    player = new Player(profile.nickName, new Date(profile.birthday), profile.state, profile.adminState, userid);
                    return repo.add(player);
                }
            }, (err) => { res.json(400, { code: 400, message: err }); })
            .then(() => {
                
            }, (err) => { res.json(400, { code: 400, message: err }); })
            .catch((err) => { res.json(500, { code: 500, message: err }); });
    }

    get INVALID_BODY() {
        return 'Invalid request body';
    }
}

module.exports = PlayerRoutes;