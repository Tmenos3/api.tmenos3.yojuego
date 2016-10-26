var ESRepository = require('./ESRepository');
var FriendRequest = require('./models/FriendRequest');

class FriendRequestESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }
}

module.exports = FriendRequestESRepository;