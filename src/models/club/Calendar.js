'use strict'

class Calendar {
    constructor(events) {
        this.events = events;
    }

    addEvent(event){
        this.events.push(event);
    }

    removeEvent(event){
        this.events.pop(event);
    }
}

module.exports = Calendar;