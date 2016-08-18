var mongoose = require('mongoose');
var Schema = mongoose.Schema; 


var UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

var UserMap = mongoose.model('User', UserSchema);

module.exports = UserMap;