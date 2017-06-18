'use strict'
let Validator = require('no-if-validator').Validator;
let HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;
let CustomCondition = require('no-if-validator').CustomCondition;

class Facility {
    constructor(name) {
        let validator = new Validator();
        validator.addCondition(new HasNotBlankSpacesCondition(name).throw(new Error(Facility.INVALID_NAME)));

        validator.execute(() => {
            this.name = name;
        }, (err) => { throw err; });
    }

    static get INVALID_NAME() { return 'Invalid name'; }
}

class Buffet extends Facility {
    constructor() {
        super('buffet');
    }
}

class MenLockers extends Facility {
    constructor() {
        super('men_lockers');
    }
}

class WomenLockers extends Facility {
    constructor() {
        super('women_dressingRoom');
    }
}

class Grill extends Facility {
    constructor() {
        super('grill');
    }
}

module.exports = { Facility, Buffet, MenLockers, WomenLockers, Grill };