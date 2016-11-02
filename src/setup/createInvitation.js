let createInvitation = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'invitation',
        body: {
            properties: {
                invitationid: { type: 'string' },
                sender: { type: 'string' },
                recipient: { type: 'string' },
                match: { type: 'string' },
                createdOn: { type: 'date' }
            }
        }
    });
}

module.exports = createInvitation;