let createMatchInvitation = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'matchInvitation',
        body: {
            properties: {
                matchId: { type: 'keyword' },
                playerId: { type: 'keyword' },
                senderId: { type: 'keyword' },
                receivedOn: { type: 'date' },
                sendedOn: { type: 'date' },
                status: { type: 'string' },
                matchInvitationAudit: {
                    createdBy: { type: 'keyword' },
                    createdOn: { type: 'date' },
                    createdFrom: { type: 'string' },
                    modifiedBy: { type: 'keyword' },
                    modifiedOn: { type: 'date' },
                    modifiedFrom: { type: 'string' }
                }
            }
        }
    });
}

module.exports = createMatchInvitation;