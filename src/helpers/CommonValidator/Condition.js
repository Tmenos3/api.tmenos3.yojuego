class Condition{
    constructor(err){
        if (this._isNullOrUndefined(err)) {
            throw new Error(Condition.INVALID_ERROR());
        }else{
            this._err = err;
        }
    }

    isValid(){
        throw new Error(Condition.MUST_BE_OVERRIDED());
    }

    getError(){
        return this._err;
    }

    _isNullOrUndefined (element) { 
        return (element === undefined || element === null); 
    };

    static INVALID_ERROR(){
        return 'Debe proporcionar un error válido.';
    }

    static MUST_BE_OVERRIDED(){
        return 'Esta función debe ser sobreescrita.';
    }
}

module.exports = Condition;