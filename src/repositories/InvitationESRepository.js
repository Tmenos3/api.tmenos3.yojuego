var ESRepository = require('../common/ESRepository');
var Invitation = require('../models/Invitation');

class InvitationESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._getNewInvitation = this._getNewInvitation.bind(this);
    }

    get(invitationId) {
        return new Promise((resolve, reject) => {
            super.get(invitationId, 'yojuego', 'invitation')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'Invitation does not exist', resp: null });
                    } else {
                        var invitation = this._getNewInvitation(objRet.resp._source);

                        invitation._id = objRet.resp._id;
                        resolve({ code: 200, message: null, resp: invitation });
                    }
                }, reject);
        });
    }

    _getNewInvitation(source) {
        return new Invitation(source.senderId, source.recipientId, source.matchId, source.createdOn, source.state);
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
                    var invitation = null;

                    for (let i = 0; i < response.hits.hits.length; i++) {
                        // invitation = new Invitation(response.hits.hits[i]._source.sender,
                        //     response.hits.hits[i]._source.sender,
                        //     response.hits.hits[i]._source.match,
                        //     response.hits.hits[i]._source.createdOn);
                        invitation = this._getNewInvitation(response.hits.hits[i]._source);
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
                senderId: invitation.senderId,
                recipientId: invitation.recipientId,
                matchId: invitation.matchId,
                createdOn: invitation.createdOn,
                state: invitation.state
            };
            return super.update(invitation._id, document, 'yojuego', 'invitation');
        } else {
            return Promise.reject({ code: 410, message: InvitationESRepository.INVALID_INSTANCEOFINVITATION });
        }
    }

    static get INVALID_INSTANCEOFINVITATION() {
        return "Invalid invitation";
    }
}

module.exports = InvitationESRepository;