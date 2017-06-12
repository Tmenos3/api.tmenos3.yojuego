'use strict'
let Validator = require('no-if-validator').Validator;
let HasNotBlankSpacesCondition = require('no-if-validator').HasNotBlankSpacesCondition;
let CustomCondition = require('no-if-validator').CustomCondition;

class Facility {
    constructor(name, available) {
        let validator = new Validator();
        validator.addCondition(new HasNotBlankSpacesCondition(name).throw(new Error(Facility.INVALID_NAME)));
        validator.addCondition(new CustomCondition(() => {
            return available && available != null && typeof (available) === "boolean";
        }).throw(new Error(Facility.INVALID_AVAILABLE)));

         validator.execute(() => {
            this.name = name;
            this.available = available;
        }, (err) => { throw err; });
    }

    static get INVALID_NAME() { return 'Invalid name'; }
    static get INVALID_AVAILABLE() { return 'Invalid available'; }
}

class Buffet extends Facility {
    constructor(available) {
        super('buffet', available);
    }
}

class MenLockers extends Facility {
    constructor(available) {
        super('men_lockers', available);
    }
}

class WomenLockers extends Facility {
    constructor(available) {
        super('women_dressingRoom', available);
    }
}

class Grill extends Facility {
    constructor(available) {
        super('grill', available);
    }
}

module.exports = Facility;