var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var petSchema = new Schema ({
    name: String,
    type: String,
    breed: String,
    bio: String,
    image: String
});

var Pets = mongoose.model('Pets', petSchema);

module.exports = Pets;
