var express = require ('express');
var router = express.Router ();

var adminRoutes = require ('./admin.js');
router.use ('/admin', adminRoutes);

// Load the Post and Comment schema object.
var Post = require ('../../model/post.js');

// Route to view my posts.
router.get ('/', function (request, response) {

    Post.find ({}, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to load posts.';
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {

            // Check to see if we need to reply with a JSON object.
            if (request.sendJson == true) {
                response.json (result);
            }
            else {
                response.render ('post/list', {
                    data: {
                        postList: result
                    }
                });
            }
        }
    });
});


// Route to grab a specific item by it's id.
router.get ('/:id', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var postId = request.params.id;

    Post.findById (postId)
    .populate ({
        path: 'comments'
    })
    .exec (function (error, result) {
        if (error) {
            var errorMessage = 'Unable to find post by id.';
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            if (request.sendJson == true) {
                response.json (result);
            }
            else {
                response.render ('post/view', {
                    data: {
                        post: result
                    }
                });
            }
        }
    });
});

module.exports = router;
