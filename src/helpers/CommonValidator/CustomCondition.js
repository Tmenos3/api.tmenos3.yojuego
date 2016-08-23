var Condition = require('./Condition');

class CustomCondition extends Condition{
    constructor(customAction, err){
        super(err);

        if (this._isNullOrUndefined(customAction)) {
            throw new Error(CustomCondition.INVALID_CUSTOM_ACTION());
        }else if(typeof customAction !== 'function'){
            throw new Error(CustomCondition.INVALID_CUSTOM_ACTION());
        }else{
            this._customAction = customAction;
        }
    }

    isValid(){
        try {
          return this._customAction();
        } catch (error) {
            this._err = error.message;
            return false;
        }
    }

    static INVALID_CUSTOM_ACTION(){
        return 'Debe proporcionar acción válida.';
    }
}

module.exports = CustomCondition;
