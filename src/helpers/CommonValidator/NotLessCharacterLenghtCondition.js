var Condition = require('./Condition');

class NotLessCharacterLenghtCondition extends Condition {
    constructor(value, characterLength, err) {
        super(err);

        this._value = value;
        this._characterLength = characterLength;
    }

    isValid() {
        return this._value.length > this._characterLength;
    }
}

module.exports = NotLessCharacterLenghtCondition;