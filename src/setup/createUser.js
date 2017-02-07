let createUser = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'user',
        body: {
            properties: {
                id: { type: 'string', index: 'not_analyzed' },
                password: { type: 'string' },
                type: { type: 'string', index: 'not_analyzed' },
                userAudit: {
                    lastAccess: { type: 'date' },
                    lastToken: { type: 'string', index: 'not_analyzed' },
                    createdBy: { type: 'string', index: 'not_analyzed' },
                    createdOn: { 'type': 'date' },
                    createdFrom: { 'type': 'string' },
                    modifiedBy: { type: 'string', index: 'not_analyzed' },
                    modifiedOn: { type: 'date' },
                    modifiedFrom: { type: 'string' }
                }
            }
        }
    });
}

module.exports = createUser;