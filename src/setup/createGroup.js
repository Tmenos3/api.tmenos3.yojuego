let createGroup = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'friendShip',
        body: {
            properties: {
                description: { type: 'string' },
                photo: { type: 'string' },
                players: { type: 'string', index: 'not_analyzed' },
                admins: { type: 'string', index: 'not_analyzed' },
                groupAudit: {
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

module.exports = createGroup;