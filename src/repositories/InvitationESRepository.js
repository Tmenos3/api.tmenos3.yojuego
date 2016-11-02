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
                    let invitation = new Invitation(
                        objRet.resp.source.sender,
                        objRet.resp.source.recipient,
                        objRet.resp.source.match,
                        objRet.resp.source.createdOn);
                    invitation._id = objRet.resp._id;
                    resolve({ code: 200, message: null, resp: invitation });
                }, reject);
        });
    }

    getByInvitationId(invitationid) {
        //TEST: full test require
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "invitation",
                "body": {
                    "query": {
                        "bool": {
                            "filter": [
                                { "term": { "invitationid": invitationid } }
                            ]
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    let invitation = null;

                    for (let i = 0; i < response.hits.hits.length; i++) {

                        invitation = new Invitation(response.hits.hits[i]._source.sender,
                            response.hits.hits[i]._source.sender,
                            response.hits.hits[i]._source.match,
                            response.hits.hits[i]._source.createdOn);
                        invitation._id = response.hits.hits[i]._id;
                        break;
                    }

                    resolve({ code: 0, message: null, resp: player });
                }
            });
        });
    }

    add(invitation) {
        if (invitation instanceof Invitation) {
            return super.add(invitation, 'yojuego', 'invitation');
        } else {
            return Promise.reject({ code: 410, message: InvitationESRepository.INVALID_INSTANCEOFINVITATION });
        }
    }

    update(invitation) {
        if (invitation instanceof Invitation) {
            let document = {
                sender: invitation.sender,
                recipient: invitation.recipient,
                match: invitation.match,
                createdOn: invitation.createdOn
            };
            return super.update(invitation._id, document, 'yojuego', 'invitation');
        } else {
            return Promise.reject({ code: 410, message: MatchESRepository.INVALID_INSTANCEOFINVITATION });
        }
    }

    static get INVALID_INSTANCEOFINVITATION() {
        return "Invalid invitation";
    }
}

module.exports = InvitationESRepository;