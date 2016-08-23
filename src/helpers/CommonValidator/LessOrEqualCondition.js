var CompareToCondition = require('./CompareToCondition');

class LessOrEqualCondition extends CompareToCondition {
    constructor(value, compareTo, err){
        super(value, 'LSE', compareTo, err);
    }

    isValid(){
        return super.isValid();
    }
}

module.exports = LessOrEqualCondition;