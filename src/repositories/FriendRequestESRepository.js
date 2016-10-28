var ESRepository = require('./ESRepository');
var FriendRequest = require('./models/FriendRequest');

class FriendRequestESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(friendRequestID) {
        return new Promise((resolve, reject) => {
            super.get(friendRequestID, 'yojuego', 'friendRequest')
                .then((object) => {
                    let friendRequest = new FriendRequest(objRet.resp.source.sender, objRet.resp.source.recipient);
                    friendRequest.id = objRet.resp._id;

                    resolve({ code: 200, message: null, resp: friendRequest });
                }, reject);
        });
    }

    add(friendRequest) {

    }

    update(friendRequest) {

    }

}

module.exports = FriendRequestESRepository;