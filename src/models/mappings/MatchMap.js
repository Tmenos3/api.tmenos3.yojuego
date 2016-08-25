var mongoose = require('mongoose');
var Schema = mongoose.Schema; 


var MatchSchema = mongoose.Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    datetime: {type: String, required: true},
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
});

var MatchMap = mongoose.model('Match', MatchSchema);

module.exports = MatchMap;