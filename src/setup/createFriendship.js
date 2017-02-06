let createFriendship = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'friendShip',
        body: {
            properties: {
                playerId: { type: 'string', index: 'not_analyzed' },
                friendId: { type: 'string', index: 'not_analyzed' },
                status: { type: 'string' },
                info: {
                    properties: {
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        photo: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        nickName: { type: 'string' }
                    }
                },
                friendshipAudit: {
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

module.exports = createFriendship;