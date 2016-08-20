var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class NotIsTypeOfIntegerCondition {
    constructor(value, err) {
        if (isNullOrUndefined(err)) {
            throw new Error(NotIsTypeOfIntegerCondition.INVALID_ERROR());
        } else {
            this._value = value;
            this._err = err;
        }
    }

    isValid() {
        return (Number.isInteger(this._value));
    }

    getError() {
        return this._err;
    }

    static INVALID_ERROR() {
        return 'Debe proporcionar un error válido.';
    }
}

module.exports = NotIsTypeOfIntegerCondition;