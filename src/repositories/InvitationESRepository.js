var ESRepository = require('./ESRepository');
var Invitation = require('../models/Invitation');

class InvitationESRepository extends ESRepository {
    constructor(client) {
        super(client);
    }

    getById(invitationId) {
        return new Promise((resolve, reject) => {
            super.getById(invitationId, 'yojuego', 'invitation')
                .then((objRet) => {
                    var invitation = new Invitation(objRet.source.sender, objRet.source.recipient, objRet.source.match);
                    resolve(invitation);
                }, reject);
        });
    }
}

module.exports = InvitationESRepository;