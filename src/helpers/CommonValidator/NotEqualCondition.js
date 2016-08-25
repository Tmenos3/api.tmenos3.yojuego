var CompareToCondition = require('./CompareToCondition');

class NotEqualCondition extends CompareToCondition {
    constructor(value, compareTo, err){
        super(value, 'EQ', compareTo, err);
    }

    isValid(){
        return !super.isValid();
    }
}

module.exports = NotEqualCondition;
