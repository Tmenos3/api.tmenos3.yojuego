'use strict'

class Event {
    constructor(date, time, matchId) {
        this.date = date;
        this.time = time;
        this.matchId = matchId;
    }
}

module.exports = Event;