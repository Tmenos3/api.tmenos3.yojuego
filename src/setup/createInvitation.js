let createInvitation = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'invitation',
        body: {
            properties: {
                sender: { type: 'string' },
                recipient: { type: 'string' },
                match: { type: 'string' },
                createdOn: { type: 'string' }
            }
        }
    });
}

module.exports = createInvitation;