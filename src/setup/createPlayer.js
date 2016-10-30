let createPlayer = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'player',
        body: {
            properties: {
                userid: { type: 'string' },
                nickname: { type: 'string' },
                birthday: { type: 'date' },
                state: { type: 'string' },
                adminState: { type: 'string' }
            }
        }
    });
}

module.exports = createPlayer;