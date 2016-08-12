'use strict'

 var CommonValidatorHelper = require('../helpers/CommonValidator/CommonValidatorHelper');
 var NotNullOrUndefinedCondition = require('../helpers/CommonValidator/NotNullOrUndefinedCondition');
 var CustomCondition = require('../helpers/CommonValidator/CustomCondition');
// get an instance of mongoose and mongoose.Schema
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

class User{
    constructor(username, password){
        var conditions = [
            new NotNullOrUndefinedCondition(username, User.INVALID_USERNAME()),
            new NotNullOrUndefinedCondition(password, User.INVALID_PASSWORD()),
            new CustomCondition(() => { return username !== password }, User.PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME())
        ];
        
        var validator = new CommonValidatorHelper(conditions, () => { 
            this.username = username;
            this.password = password;  
        }, (err) => { throw new Error(err); });
        validator.execute();
    }

    static INVALID_USERNAME(){
        return 'Debe proveer un username válido (al menos 5 caracteres entre letras, numeros, puntos y unserscore).';
    }

    static INVALID_PASSWORD(){
        return 'Debe proveer un username válido (al menos 5 caracteres).';
    }

    static PASSWORD_CANNOT_BE_EQUAL_TO_USERNAME(){
        return 'El password no puede ser igual al username.';
    }
}

module.exports = User;

// set up a mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({ 
//     username: String, 
//     password: String, 
//     admin: Boolean 
// }));