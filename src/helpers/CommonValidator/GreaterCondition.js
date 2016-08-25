var CompareToCondition = require('./CompareToCondition');

class GreaterCondition extends CompareToCondition {
    constructor(value, compareTo, err){
        super(value, 'GR', compareTo, err);
    }

    isValid(){
        return super.isValid();
    }
}

module.exports = GreaterCondition;
