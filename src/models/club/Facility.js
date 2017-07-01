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

    static get get(facility) {
        switch (facility.name) {
            case BUFFET:
                return new Buffet();
            case MEN_LOCKERS:
                return new MenLockers();
            case WOMEN_LOCKERS:
                return new WomenLockers();
            case GRILL:
                return new Grill();
            default:
                break;
        }
    }


    static get BUFFET() { return 'buffet'; }
    static get MEN_LOCKERS() { return 'men_lockers'; }
    static get WOMEN_LOCKERS() { return 'women_lockers'; }
    static get GRILL() { return 'grill'; }
}

class Buffet extends Facility {
    constructor() {
        super(Facility.BUFFET);
    }
}

class MenLockers extends Facility {
    constructor() {
        super(Facility.MEN_LOCKERS);
    }
}

class WomenLockers extends Facility {
    constructor() {
        super(Facility.WOMEN_LOCKERS);
    }
}

class Grill extends Facility {
    constructor() {
        super(Facility.GRILL);
    }
}

module.exports = { Facility, Buffet, MenLockers, WomenLockers, Grill };