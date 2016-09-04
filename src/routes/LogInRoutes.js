import Routes from './Routes';

class LogInRoutes extends Routes{
    constructor() { 
        super(); 
    }

    _addAllRoutes(server){
        server.get('/logIn/facebook/callback', (req, res, next) => { });
        server.get('/logIn/google/callback', (req, res, next) => { });
        server.post('/logIn/local', (req, res, next) => { });
        server.post('/logIn/facebook', (req, res, next) => { });
        server.post('/logIn/google', (req, res, next) => { });
    }
}

module.exports = LogInRoutes;