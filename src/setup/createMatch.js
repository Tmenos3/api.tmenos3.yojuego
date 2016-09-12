let createMatch = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'match',
        body: {
            properties: {
                title: { type: 'string' },
                date: { type: 'date' },
                fromTime: { type: 'string' },
                toTime: { type: 'string' },
                location: { type: 'string' },
                matchType: { type: 'string' },
                createdBy: { type: 'string' },
                createdOn: { type: 'date' }
            }
        }
    });
}

module.exports = createMatch;