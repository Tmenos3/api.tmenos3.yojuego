var ESRepository = require('./ESRepository');
var Invitation = require('../models/Invitation');

class InvitationESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    get(invitationId) {
        return new Promise((resolve, reject) => {
            super.get(invitationId, 'yojuego', 'invitation')
                .then((objRet) => {
                    let invitation = new Invitation(objRet.resp.source.sender, objRet.resp.source.recipient, objRet.resp.source.match);
                    invitation._id = objRet.resp._id;
                    resolve({ code: 200, message: null, resp: invitation });
                }, reject);
        });
    }
}

module.exports = InvitationESRepository;