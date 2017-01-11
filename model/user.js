var mongoose = require ('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema ({
    username: String,
    password: String,
    email: String,
    admin: Boolean,
    bio: String,
    picture: String,
    // Linking pet object by objects ID
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pets'}]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
