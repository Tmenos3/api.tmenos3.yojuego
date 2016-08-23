var CompareToCondition = require('./CompareToCondition');

class GreaterOrEqualCondition extends CompareToCondition {
    constructor(value, compareTo, err){
        super(value, 'GRE', compareTo, err);
    }

    isValid(){
        return super.isValid();
    }
}

module.exports = GreaterOrEqualCondition;
