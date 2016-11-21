var ESRepository = require('./ESRepository');
var Club = require('../models/club/Club');
var Event = require('../models/club/Event');
var Facilities = require('../models/club/Facilities');
var Calendar = require('../models/club/Calendar');
var Field = require('../models/club/Field');
var ContactInfo = require('../models/club/ContactInfo');

class ClubESRepository extends ESRepository {
    constructor(client) {
        super(client);

        this._mapCalendar = this._mapCalendar.bind(this);
        this._mapContactInfo = this._mapContactInfo.bind(this);
        this._mapFields = this._mapFields.bind(this);
        this._mapFacilities = this._mapFacilities.bind(this);
    }

    getAll() {
        return new Promise((resolve, reject) => {
            resolve({ code: 200, message: null, resp: [] });
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
                        resolve({ code: 404, message: 'No clubs were found.', resp: null });
                    } else {
                        let clubs = [];

                        for (let i = 0; i < response.hits.hits.length; i++) {
                            constructor(description, facilities, fields, allowOnLineBooking, allowOnLinePayment, cancelingTimeForFree, contactInfo, calendar)
                            let club = new Club(response.hits.hits[i]._source.description,
                                this._mapFacilities(response.hits.hits[i]._source.facilities),
                                this._mapFields(response.hits.hits[i]._source.fields),
                                response.hits.hits[i]._source.allowOnLineBooking,
                                response.hits.hits[i]._source.allowOnLinePayment,
                                response.hits.hits[i]._source.cancelingTimeForFree,
                                this._mapContactInfo(response.hits.hits[i]._source.contactInfo),
                                this._mapCalendar(response.hits.hits[i]._source.calendar));

                            club._id = response.hits.hits[i]._id;
                            clubs.push(club);
                        }

                        resolve({ code: 200, message: null, resp: clubs });
                    }
                }
            });
        });
    }

    _mapCalendar(calendar) {
        let events = [];

        for (let i = 0; i < calendar.events; i++) {
            let event = new Event(calendar.events[i].date, calendar.events[i].time, calendar.events[i].matchId)
        }

        return new Calendar(events);
    }

    _mapContactInfo(contactInfo) {
        return new ContactInfo(contactInfo.mail, contactInfo.telephones, contactInfo.location);
    }

    _mapFields(fields) {
        let ret = [];

        for (let i = 0; i < fields; i++) {
            let field = new Field(fields[i].groundType, fields[i].roofed, fields[i].size, fields[i].value, fields[i].minToBook);
            ret.push(field);
        }

        return ret;
    }

    _mapFacilities(facilities) {
        return new Facilities(facilities.buffet, facilities.parking, facilities.wifi, facilities.dressingRoom);
    }

    static get INVALID_CLUB() {
        return "Invalid club";
    }
}

module.exports = ClubESRepository;
