var Routes = require('./Routes');

class MatchRoutes extends Routes{
    constructor() { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/match/:id', (req, res, next) => { });
        server.get('/match/:id/invitations', (req, res, next) => { });
        server.post('/match/:id/addInvitation', (req, res, next) => { });
        server.post('/match/:id/removeInvitation', (req, res, next) => { });
        server.del('/match/:id', (req, res, next) => { });
    }
}

module.exports = MatchRoutes;