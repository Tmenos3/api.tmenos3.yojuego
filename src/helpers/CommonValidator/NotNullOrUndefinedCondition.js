var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class NotNullOrUndefinedCondition{
    constructor(value, err){
        if (isNullOrUndefined(err)) {
            throw new Error(NotNullOrUndefinedCondition.INVALID_ERROR());
        }else{
            this._value = value;
            this._err = err;
        }
    }

    isValid(){
        return this._value !== null && this._value !== undefined;
    }

    getError(){
        return this._err;
    }

    static INVALID_ERROR(){
        return 'Debe proporcionar un error válido.';
    }
}

module.exports = NotNullOrUndefinedCondition;