var Condition = require('./Condition');

class RegexCondition extends Condition {
    constructor(value, regex, err) {
        super(err);

        if (this._isNullOrUndefined(regex) || (!this._isString(regex))) {
            throw new Error(RegexCondition.INVALID_REGEX());
        } else {
            this._value = value;
            this._regex = regex;
        }
    }

    isValid() {
        var reg = new RegExp(this._regex)
        return reg.test(this._value);
    }

    _isString(s) {
        return typeof (s) === 'string' || s instanceof String;
    }

    static INVALID_REGEX() {
        return 'Debe proporcionar una expresion regular válida.';
    }
}

module.exports = RegexCondition;
