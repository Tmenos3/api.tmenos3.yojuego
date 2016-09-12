let createPlayer = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'player',
        body: {
            properties: {
                userId: { type: 'string' },
                nickname: { type: 'string' },
                birthday: { type: 'string' },
                state: { type: 'string' },
                adminState: { type: 'string' },
            }
        }
    });
}

module.exports = createPlayer;