let createPlayer = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'player',
        body: {
            properties: {
                userId: { type: 'string' },
                nickname: { type: 'string' },
                birthday: { type: 'date' },
                state: { type: 'string' },
                adminState: { type: 'string' },
                createdOn: { type: 'date' },
                modifiedOn: { type: 'date' }
            }
        }
    });
}

module.exports = createPlayer;