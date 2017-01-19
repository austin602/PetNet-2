var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var petSchema = new Schema ({
    name: String,
    type: String,
    breed: String,
    bio: String,
    imageUrl: String
});

var Pets = mongoose.model('Pets', petSchema);

module.exports = Pets;
