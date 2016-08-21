var mongoose = require('mongoose');
var Schema = mongoose.Schema; 


var PlayerSchema = mongoose.Schema({
    _idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    profile: {
        nickname: String
    },
    matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
});

var PlayerMap = mongoose.model('Player', PlayerSchema);

module.exports = PlayerMap;