import Routes from './Routes';

class InvitationRoutes extends Routes{
    constructor() { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/invitation/:id', (req, res, next) => { });
        server.post('/invitation/:id/accept', (req, res, next) => { });
        server.post('/invitation/:id/reject', (req, res, next) => { });
        server.delete('/invitation/:id', (req, res, next) => { });
    }
}

module.exports = InvitationRoutes;