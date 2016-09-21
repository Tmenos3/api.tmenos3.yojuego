let createUser = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'user',
        body: {
            properties: {
                id: { type: 'string' },
                type: { type: 'string' }
            }
        }
    });
}

module.exports = createUser;