var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var eventSchema = new Schema ({
    name: String,
    date: String,
    time: String,
    description: String,
    location: String
});
var Event = mongoose.model ('Event' , eventSchema);

module.exports = Event;
