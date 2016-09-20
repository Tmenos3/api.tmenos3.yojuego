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
        server.get('/player/:id/profile', (req, res, next) => { });
        server.get('/player/:id/upcomingMatches', (req, res, next) => { });
        server.post('/player/create', (req, res, next) => { });
        server.post('/player/:id/update', (req, res, next) => { });
        server.del('/player/:id', (req, res, next) => { });
        server.post('/:userid/player/profile', this._bodyIsNotNull, this._updateProfile);
    }

    _bodyIsNotNull(req, res, next) {
        let validator = new Validator();
        validator.addCondition(new NotNullOrUndefinedCondition(req.body).throw(PlayerRoutes.INVALID_BODY));

        validator.execute(() => { next(); }, (err) => { res.json(400, { code: 1, message: err.message }); });
    }

    _updateProfile(req, res, next) {
        repo.getByUserId(req.params.userid)
            .then((playerReturned) => {
                if (playerReturned) {
                    playerReturned.nickName = req.body.nickname;
                    playerReturned.birthday = new Date(req.body.birthday);
                    playerReturned.state = req.body.state;
                    playerReturned.adminState = req.body.adminState;
                    return repo.update(playerReturned);
                } else {
                    let player = new Player(req.body.nickname, new Date(req.body.birthday), req.body.state, req.body.adminState, req.params.userid);
                    return repo.add(player);
                }
            }, (err) => { res.json(400, { code: 400, message: err }); })
            .then((ret) => {
                if(ret.code === 0){
                    res.json(200, 'saved');
                    next();
                }else{
                    res.json(400, { code: 400, message: ret.message });
                }
            }, (err) => { res.json(400, { code: 400, message: err }); })
            .catch((err) => { res.json(500, { code: 500, message: err }); });
    }

    static get INVALID_BODY() {
        return 'Invalid request body';
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
}

module.exports = PlayerRoutes;