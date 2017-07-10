let createUser = (esClient, index) => {
  return new Promise((resolve, reject) => {
    esClient.index({
      index: index,
      type: 'user',
      body: {
        id: 'user@yojuego.com',
        password: '123456',
        type: 'YOJUEGO',
        isLogged: false,
        token: null,
        lastAccess: null,
        auditInfo: {
          createdBy: 'BOOTSTRAP',
          createdOn: new Date(),
          createdFrom: 'BOOTSTRAP',
          modifiedBy: null,
          modifiedOn: null,
          modifiedFrom: null
        }
      }
    }, (error, resp) => {
      if (error) {
        reject({ code: error.statusCode, message: error.message, resp: error });
      } else {
        esClient.get({
          index: index,
          type: 'user',
          id: resp._id
        }, (error, response) => {
          if (error) {
            reject({ code: error.statusCode, message: error.message, resp: error });
          }
          else {
            let ret = response._source;
            ret._id = response._id;
            resolve({ code: 200, message: 'DOCUMENT CREATED', resp: ret });
          }
        });
      }
    });
  });
}

let createPlayer = (esClient, index, user) => {
  return new Promise((resolve, reject) => {
    esClient.index({
      index: index,
      type: 'player',
      body: {
        firstName: 'Player',
        lastName: 'Bootstraped',
        nickName: 'Player Bootstraped',
        photo: null,
        email: user.id,
        phone: null,
        userid: user._id,
        auditInfo: {
          createdBy: 'BOOTSTRAP',
          createdOn: new Date(),
          createdFrom: 'BOOTSTRAP',
          modifiedBy: null,
          modifiedOn: null,
          modifiedFrom: null
        }
      }
    }, (error, resp) => {
      if (error) {
        reject({ code: error.statusCode, message: error.message, resp: error });
      } else {
        esClient.get({
          index: index,
          type: 'player',
          id: resp._id
        }, (error, response) => {
          if (error) {
            reject({ code: error.statusCode, message: error.message, resp: error });
          }
          else {
            let ret = response._source;
            ret._id = response._id;
            resolve({ code: 200, message: 'DOCUMENT CREATED', resp: ret });
          }
        });
      }
    });
  });
}

let createMatch = (esClient, index, player) => {
  return new Promise((resolve, reject) => {
    let date = new Date();
    date.setDate(date.getDate() + 10);
    esClient.index({
      index: index,
      type: 'match',
      body: {
        title: 'BOOSTRAPED MATCH',
        date: date,
        fromTime: '18:00',
        toTime: '19:00',
        location: 'Some court',
        matchType: 5,
        status: 'PENDING',
        creator: player._id,
        confirmedPlayers: [],
        pendingPlayers: [player._id],
        canceledPlayers: [],
        comments: [],
        matchAudit: {
          createdBy: 'BOOTSTRAP',
          createdOn: new Date(),
          createdFrom: 'BOOTSTRAP',
          modifiedBy: null,
          modifiedOn: null,
          modifiedFrom: null
        }
      }
    }, (error, resp) => {
      if (error) {
        reject({ code: error.statusCode, message: error.message, resp: error });
      } else {
        esClient.get({
          index: index,
          type: 'match',
          id: resp._id
        }, (error, response) => {
          if (error) {
            reject({ code: error.statusCode, message: error.message, resp: error });
          }
          else {
            let ret = response._source;
            ret._id = response._id;
            resolve({ code: 200, message: 'DOCUMENT CREATED', resp: ret });
          }
        });
      }
    });
  });
}

module.exports = (esClient) => {
  let userCreated = null;
  let playerCreated = null;
  return createUser(esClient, 'yojuego')
    .then((userResp) => {
      userCreated = userResp.resp;
      return createPlayer(esClient, 'yojuego', userResp.resp)
    })
    .then((playerResp) => {
      playerCreated = playerResp.resp;
      return createMatch(esClient, 'yojuego', playerResp.resp)
    })
    .then((matchResp) => {
      return {
        user: userCreated,
        player: playerCreated,
        match: matchResp.resp
      }
    })
}