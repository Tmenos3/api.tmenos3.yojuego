var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class NotHasBlankSpacesCondition {
    constructor(value, err) {
        if (isNullOrUndefined(err)) {
            throw new Error(NotHasBlankSpacesCondition.INVALID_ERROR());
        } else {
            this._value = value;
            this._err = err;
        }
    }

    isValid() {
        return !this._value.includes(' ');
    }

    getError() {
        return this._err;
    }

    static INVALID_ERROR() {
        return 'Debe proporcionar un error válido.';
    }
}

module.exports = NotHasBlankSpacesCondition;