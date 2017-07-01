var ESRepository = require('./ESRepository');
var Club = require('../models/club/Club');
// var Event = require('../models/club/Event');
var Facility = require('../models/club/Facility');
// var Calendar = require('../models/club/Calendar');
// var Field = require('../models/club/Field');
// var ContactInfo = require('../models/club/ContactInfo');

class ClubESRepository extends ESRepository {
    constructor(client) {
        super(client);

        // this._mapCalendar = this._mapCalendar.bind(this);
        // this._mapContactInfo = this._mapContactInfo.bind(this);
        // this._mapFields = this._mapFields.bind(this);
        this._mapFacilities = this._mapFacilities.bind(this);
        // this._getNewClub = this._getNewClub.bind(this);
    }

    get(clubId) {
        return new Promise((resolve, reject) => {
            super.get(clubId, 'yojuego', 'club')
                .then((objRet) => {
                    if (objRet.code == 404) {
                        resolve({ code: 404, message: 'Club does not exist', resp: null });
                    } else {
                        var club = this._getNewClub(objRet.resp._source);

                        club._id = objRet.resp._id;
                        resolve({ code: 200, message: null, resp: club });
                    }
                }, reject);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            super.getAll('yojuego', 'club')
                .then((objRet) => {
                    var clubs = [];

                    for (var i = 0; i < objRet.resp.hits.hits.length; i++) {
                        var club = this._getNewClub(objRet.resp.hits.hits[i]._source);
                        club._id = objRet.resp.hits.hits[i]._id;
                        clubs.push(club);
                    }

                    resolve({ code: 200, message: null, resp: clubs });
                }, reject);
        });
    }

    getBy(criterias) {
        //TEST: not null, not undefined
        //TEST: criterias must be an array
        return new Promise((resolve, reject) => {
            this.esclient.search({
                "index": "yojuego",
                "type": "club",
                "body": {
                    "query": {
                        "bool": {
                            // "filter": [
                            //     { "term": { "type": type } },
                            //     { "term": { "id": id } }
                            // ]
                            "filter": criterias
                        }
                    }
                }
            }, (error, response) => {
                if (error) {
                    reject({ code: error.statusCode, message: error.message, resp: error });
                }
                else {
                    if (response.hits.hits.length < 1) {
                        resolve({ code: 404, message: 'No clubs were found.', resp: [] });
                    } else {
                        var clubs = [];

                        for (var i = 0; i < response.hits.hits.length; i++) {
                            var club = this._getNewClub(response.hits.hits[i]._source);

                            club._id = response.hits.hits[i]._id;
                            clubs.push(club);
                        }

                        resolve({ code: 200, message: null, resp: clubs });
                    }
                }
            });
        });
    }

    // _mapCalendar(calendar) {
    //     let events = [];

    //     for (let i = 0; i < calendar.events.length; i++) {
    //         let event = new Event(calendar.events[i].date, calendar.events[i].time, calendar.events[i].matchId)
    //     }

    //     return new Calendar(events);
    // }

    // _mapContactInfo(contactInfo) {
    //     return new ContactInfo(contactInfo.mail, contactInfo.telephones, contactInfo.location);
    // }

    // _mapFields(fields) {
    //     let ret = [];

    //     for (let i = 0; i < fields.length; i++) {
    //         let field = new Field(fields[i].groundType, fields[i].roofed, fields[i].size, fields[i].value, fields[i].minToBook);
    //         ret.push(field);
    //     }

    //     return ret;
    // }

    _mapFacilities(collection) {
        let facilities = [];

        map.forEach(function (facility) {
            facilities.push(Facility.get(facility));
        }, this);

        return facilities;
    }

    _getNewClub(source) {
        return new Club(
            source.name,
            source.description,
            this._mapFacilities(source.facilities),
            source.allowOnlineBooking,
            source.allowOnlinePayment,
            source.freeCancellationTime
        );
    }

    static get INVALID_CLUB() {
        return "Invalid club";
    }

    static get INVALID_INSTANCE_CLUB() { return 'Invalid intance club'; }
}

module.exports = ClubESRepository;
