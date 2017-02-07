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
                matchType: { type: 'integer' },
                club: { type: 'string', index: 'not_analyzed' },
                creator: { type: 'string', index: 'not_analyzed' },
                confirmedPlayers: { type: 'string', index: 'not_analyzed' },
                pendingPlayers: { type: 'string', index: 'not_analyzed' },
                comments: {
                    properties: {
                        id: { type: 'integer' },
                        owner: { type: 'string' },
                        text: { type: 'string' },
                        writtenOn: { type: 'date' }
                    }
                },
                matchAudit: {
                    createdBy: { type: 'string', index: 'not_analyzed' },
                    createdOn: { type: 'date' },
                    createdFrom: { type: 'string' },
                    modifiedBy: { type: 'string', index: 'not_analyzed' },
                    modifiedOn: { type: 'date' },
                    modifiedFrom: { type: 'string' }
                }
            }
        }
    });
}

module.exports = createMatch;