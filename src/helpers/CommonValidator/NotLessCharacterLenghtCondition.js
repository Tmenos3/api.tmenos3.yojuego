var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class NotLessCharacterLenghtCondition {
    constructor(value, characterLength, err) {
        if (isNullOrUndefined(err)) {
            throw new Error(NotLessCharacterLenghtCondition.INVALID_ERROR());
        } else {
            this._value = value;
            this._err = err;
            this.characterLength;
        }
    }

    isValid() {
        // Si pongo characterLength no funciona.
        return this._value.length > 5;
    }

    getError() {
        return this._err;
    }

    static INVALID_ERROR() {
        return 'Debe proporcionar un error válido.';
    }
}

module.exports = NotLessCharacterLenghtCondition;