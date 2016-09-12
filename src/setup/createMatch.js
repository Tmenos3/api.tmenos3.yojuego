let createMatch = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'match',
        body: {
            properties: {
                title: { type: 'string' },
                date: { type: 'string' },
                fromTime: { type: 'string' },
                toTime: { type: 'string' },
                location: { type: 'string' },
                matchType: { type: 'string' },
                creator: { type: 'string' },
                createdOn: { type: 'string' }
            }
        }
    });
}

module.exports = createMatch;