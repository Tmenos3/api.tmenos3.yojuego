var RegexCondition = require('./RegexCondition');

class ValidMailCondition extends RegexCondition{
    constructor(mail, err){
        super(mail, '^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$', err);
    }

    isValid(){
        return super.isValid();
    }
}

module.exports = ValidMailCondition;
