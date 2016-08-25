var Condition = require('./Condition');

var isNullOrUndefined = (element) => { return (element === undefined || element === null); };

class PromiseValidationHelper {
    constructor(conditionsList) {
        if (isNullOrUndefined(conditionsList)) {
            throw new Error(PromiseValidationHelper.INVALID_CONDITION_LIST());
        } else if (!(conditionsList instanceof Array)) {
            throw new Error(PromiseValidationHelper.INVALID_CONDITION_LIST());
        } else {
            conditionsList.forEach(function (element) {
                if (!(element instanceof Condition)) {
                    throw new Error(PromiseValidationHelper.INVALID_CONDITION_LIST());
                }
            }, this);

            this._conditionList = conditionsList;
        }
    }

    execute() {
        return new Promise((resolve, reject) => {
            var allAreValid = true;
            for (var index = 0; index < this._conditionList.length; index++) {
                var condition = this._conditionList[index];
                if (!condition.isValid()) {
                    allAreValid = false;
                    reject(condition.getError());
                    break;
                }
            }

            if (allAreValid) {
                resolve();
            }
        });
    }

    static INVALID_CONDITION_LIST() {
        return 'Debe proporcionar una lista de condiciones valida.';
    }
}

module.exports = PromiseValidationHelper;