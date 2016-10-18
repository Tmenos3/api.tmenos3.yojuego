let createFriendship = (client) => {
    return client.indices.putMapping({
        index: 'yojuego',
        type: 'friendShip',
        body: {
            properties: {
                sender: { type: 'string' },
                recipient: { type: 'string' }
            }
        }
    });
}

module.exports = createFriendship;