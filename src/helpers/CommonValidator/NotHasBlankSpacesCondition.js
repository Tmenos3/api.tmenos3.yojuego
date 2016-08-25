var Condition = require('./Condition');

class NotHasBlankSpacesCondition extends Condition{
    constructor(value, err) {
        super(err);
        this._value = value;
    }

    isValid() {
        return !this._value.includes(' ');
    }
}

module.exports = NotHasBlankSpacesCondition;