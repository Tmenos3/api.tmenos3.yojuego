var Routes = require('./Routes');

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
        server.post('/:userid/player/profile', this._updateProfile);
    }

    _updateProfile(req, res, next) {
        //1- Chequeo obligatoriedad de parametros
        //2- Busco el player con el userId correspondientes
        //    A- El player existe: updeteo los datos
        //    B- El player no existe: creo el player
        console.log('me llamaron');
        res.json(200, 'ok');
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