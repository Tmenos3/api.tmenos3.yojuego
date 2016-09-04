import InvitationRoutes from './InvitationRoutes';
import LogInRoutes from './LogInRoutes';
import MatchRoutes from './MatchRoutes';
import PlayerRoutes from './PlayerRoutes';
import SignUpRoutes from './SignUpRoutes';

class Router {
    constructor() {

    }

    addAll(server) {
        new InvitationRoutes().add(server);
        new LogInRoutes().add(server);
        new MatchRoutes().add(server);
        new PlayerRoutes().add(server);
        new SignUpRoutes().add(server);
    }
}

module.exports = Router;