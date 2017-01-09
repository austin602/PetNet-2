var mongoose = require ('mongoose');

//grab the schema object from mongoose.
var Schema = mongoose.Schema;

var postSchema = new Schema ({
    name: String,
    description: String,
    author: String,
});
var Post = mongoose.model ('Post' , postSchema);

//make the model object available to
//other NodeJs modules.
module.exports = Post;
