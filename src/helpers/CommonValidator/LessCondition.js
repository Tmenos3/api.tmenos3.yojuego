var CompareToCondition = require('./CompareToCondition');

class LessCondition extends CompareToCondition {
    constructor(value, compareTo, err){
        super(value, 'LS', compareTo, err);
    }

    isValid(){
        return super.isValid();
    }
}

module.exports = LessCondition;
