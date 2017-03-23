let createFridnshipRequest = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'friendshipRequest',
        body: {
            properties: {
                friendshipId: { type: 'keyword' },
                friendshipRequestAudit: {
                    properties: {
                        createdBy: { type: 'keyword' },
                        createdFrom: { type: 'text' },
                        createdOn: { type: 'date' },
                        modifiedBy: { type: 'keyword' },
                        modifiedFrom: { type: 'text' },
                        modifiedOn: { type: 'date' }
                    }
                },
                playerId: { type: 'keyword' },
                receivedOn: { type: 'date' },
                sendedOn: { type: 'date' },
                status: { type: 'keyword' }
            }
        }
    });
}

module.exports = createFridnshipRequest;