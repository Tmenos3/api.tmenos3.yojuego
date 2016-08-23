var isNullOrUndefined = (element) => { return (element === undefined || element === null); };
var Condition = require('./Condition');
var NotNullOrUndefinedCondition = require('./NotNullOrUndefinedCondition');
var CustomCondition = require('./CustomCondition');

class ValidationHelper{
    constructor(conditionsList, resolveCallback, rejectCallback){
        if (isNullOrUndefined(conditionsList)) {
            throw new Error(ValidationHelper.INVALID_CONDITION_LIST());
        }else if (isNullOrUndefined(resolveCallback)) {
            throw new Error(ValidationHelper.INVALID_RESOLVE_CALLBACK());
        }else if (isNullOrUndefined(rejectCallback)) {
            throw new Error(ValidationHelper.INVALID_REJECT_CALLBACK());
        }else if(!(conditionsList instanceof Array)){
            throw new Error(ValidationHelper.INVALID_CONDITION_LIST());
        }else{
            conditionsList.forEach(function(element) {
                if(!(element instanceof Condition)){
                    throw new Error(ValidationHelper.INVALID_CONDITION_LIST());
                }
            }, this);

            this._conditionList = conditionsList;
            this._resolve = resolveCallback;
            this._reject = rejectCallback;
        }
    }

    execute(){
        var allAreValid = true;
        for (var index = 0; index < this._conditionList.length; index++) {
            var condition = this._conditionList[index];
            if (!condition.isValid()){
                allAreValid = false;
                this._reject(condition.getError());
                break;
            }
        }

        if (allAreValid){
            this._resolve();
        }
    }

    static INVALID_CONDITION_LIST(){
        return 'Debe proporcionar una lista de condiciones valida.';
    }
    
    static INVALID_RESOLVE_CALLBACK(){
        return 'Debe proporcionar un resolve callback válido.';
    }

    static INVALID_REJECT_CALLBACK(){
        return 'Debe proporcionar un reject callback válido.';
    }
}

module.exports = ValidationHelper;