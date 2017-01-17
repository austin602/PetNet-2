var mongoose = require ('mongoose');

//grab the schema object from mongoose.
var Schema = mongoose.Schema;

var blogSchema = new Schema ({
    name: String,
    description: String,
    author: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
    // author: {type: Schema.Types.ObjectId, ref: 'User'}
});
var Blog = mongoose.model ('Blog' , blogSchema);

//make the model object available to
//other NodeJs modules.
module.exports = Blog;
