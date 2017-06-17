let user = {
    user: {
        properties: {
            id: { type: "string", index: "not_analyzed" },
            password: { type: "string" },
            type: { type: "string", index: "not_analyzed" },
            isLogged: { type: "boolean" },
            token: { type: "string", index: "not_analyzed" },
            oauth: {
                properties: {
                    authToken: { type: "string", index: "not_analyzed" },
                    refreshToken: { type: "string", index: "not_analyzed" },
                    xxx: { type: "string", index: "not_analyzed" }
                }
            },
            userAudit: {
                properties: {
                    lastAccess: { type: "date" },
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let player = {
    player: {
        properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            nickName: { type: "string" },
            photo: { type: "string" },
            email: { type: "string", index: "not_analyzed" },
            phone: { type: "string", index: "not_analyzed" },
            userid: { type: "string", index: "not_analyzed" },
            playerAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let match = {
    match: {
        properties: {
            title: { type: "string" },
            date: { type: "date" },
            fromTime: { type: "string" },
            toTime: { type: "string" },
            location: { type: "string" },
            matchType: { type: "integer" },
            status: { type: "string", index: "not_analyzed" },
            creator: { type: "string", index: "not_analyzed" },
            confirmedPlayers: { type: "string", index: "not_analyzed" },
            pendingPlayers: { type: "string", index: "not_analyzed" },
            canceledPlayers: { type: "string", index: "not_analyzed" },
            comments: {
                properties: {
                    id: { type: "integer" },
                    owner: { type: "string" },
                    text: { type: "string" },
                    writtenOn: { type: "date" }
                }
            },
            matchAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let friendship = {
    friendship: {
        properties: {
            playerId: { type: "string", index: "not_analyzed" },
            friendId: { type: "string", index: "not_analyzed" },
            email: { type: "string", index: "not_analyzed" },
            status: { type: "string", index: "not_analyzed" },
            friendshipAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let group = {
    group: {
        properties: {
            description: { type: "string" },
            photo: { type: "string" },
            players: { type: "string", index: "not_analyzed" },
            admins: { type: "string", index: "not_analyzed" },
            groupAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let friendshipRequest = {
    friendshipRequest: {
        properties: {
            friendshipId: { type: "string", index: "not_analyzed" },
            playerId: { type: "string", index: "not_analyzed" },
            status: { type: "string", index: "not_analyzed" },
            sendedOn: { type: "date" },
            receivedOn: { type: "date" },
            friendshipRequestAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

let matchInvitation = {
    matchInvitation: {
        properties: {
            matchId: { type: "string", index: "not_analyzed" },
            playerId: { type: "string", index: "not_analyzed" },
            senderId: { type: "string", index: "not_analyzed" },
            status: { type: "string", index: "not_analyzed" },
            sendedOn: { type: "date" },
            receivedOn: { type: "date" },
            matchInvitationAudit: {
                properties: {
                    createdBy: { type: "string", index: "not_analyzed" },
                    createdOn: { type: "date" },
                    createdFrom: { type: "string" },
                    modifiedBy: { type: "string", index: "not_analyzed" },
                    modifiedOn: { type: "date" },
                    modifiedFrom: { type: "string" }
                }
            }
        }
    }
}

module.exports = {
    user,
    player,
    match,
    friendship,
    group,
    friendshipRequest,
    matchInvitation
}