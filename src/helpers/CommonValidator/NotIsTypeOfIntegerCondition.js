var Condition = require('./Condition');

class NotIsTypeOfIntegerCondition extends Condition{
    constructor(value, err) {
        super(err);
        this._value = value;
    }

    isValid() {
        return (Number.isInteger(this._value));
    }
}

module.exports = NotIsTypeOfIntegerCondition;