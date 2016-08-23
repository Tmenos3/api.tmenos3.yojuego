var Condition = require('./Condition');

class NotNullOrUndefinedCondition extends Condition {
    constructor(value, err){
        super(err);
        this._value = value;
    }

    isValid(){
        return !(this._isNullOrUndefined(this._value));
    }
}

module.exports = NotNullOrUndefinedCondition;
