var ESRepository = require('./ESRepository');
var FriendShip = require('./models/FriendShip');

class FriendshipESRepository extends ESRepositoryÍ {
    constructor(client) {
        super(client);
    }
}
module.exports = FriendshipESRepository;