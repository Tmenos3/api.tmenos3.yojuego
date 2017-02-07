let createUser = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'user',
        body: {
            properties: {
                id: { type: 'string', index: 'keyword' },
                password: { type: 'string' },
                type: { type: 'string', index: 'keyword' },
                userAudit: {
                    lastAccess: { type: 'date' },
                    lastToken: { type: 'string', index: 'keyword' },
                    createdBy: { type: 'string', index: 'keyword' },
                    createdOn: { 'type': 'date' },
                    createdFrom: { 'type': 'string' },
                    modifiedBy: { type: 'string', index: 'keyword' },
                    modifiedOn: { type: 'date' },
                    modifiedFrom: { type: 'string' }
                }
            }
        }
    });
}

module.exports = createUser;