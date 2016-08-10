var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class Condition{
    constructor(err){
        if (isNullOrUndefined(err)) {
            throw new Error(Condition.INVALID_ERROR());
        }else{
            this._err = err;
        }
    }

    isValid(){
        return true;
    }

    getError(){
        return this._err;
    }

    static INVALID_ERROR(){
        return 'Debe proporcionar un error válido.';
    }
}

module.exports = Condition;