var Condition = require('./Condition');

class InstanceOfCondition extends Condition{
    constructor(value, type, err) {
        super(err);

         if (this._isNullOrUndefined(type)) {
             throw new Error(InstanceOfCondition.INVALID_TYPE());
         }else{
            this._value = value;
            this._type = type;
         }
    }

    isValid() {
        return (this._value instanceof this._type);
    }

    static INVALID_TYPE(){
        return 'El tipo proporcionado es inválido';
    }
}

module.exports = InstanceOfCondition;