var Routes = require('./Routes');

class InvitationRoutes extends Routes{
    constructor(esClient) { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/invitation/:id', (req, res, next) => { });
        server.post('/invitation/:id/accept', (req, res, next) => { });
        server.post('/invitation/:id/reject', (req, res, next) => { });
        server.del('/invitation/:id', (req, res, next) => { });
    }
}

module.exports = InvitationRoutes;