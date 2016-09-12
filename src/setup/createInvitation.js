let createInvitation = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'invitation',
        body: {
            properties: {
                sender: { type: 'string' },
                recipient: { type: 'string' },
                match: { type: 'string' },
                state: { type: 'string' },
                limitToBeAccepted: { type: 'date' },
                createdBy: { type: 'string' },
                createdOn: { type: 'date' },
                modifiedOn: { type: 'date' }
            }
        }
    });
}

module.exports = createInvitation;