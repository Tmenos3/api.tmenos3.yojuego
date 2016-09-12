let createMatch = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'match',
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

module.exports = createMatch;