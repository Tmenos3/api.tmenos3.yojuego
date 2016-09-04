import Routes from './Routes';

class PlayerRoutes extends Routes{
    constructor() { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/player/:id/profile', (req, res, next) => { });
        server.get('/player/:id/upcomingMatches', (req, res, next) => { });
        server.post('/player/create', (req, res, next) => { });
        server.post('/player/:id/update', (req, res, next) => { });
        server.delete('/player/:id', (req, res, next) => { });
    }
}

module.exports = PlayerRoutes;