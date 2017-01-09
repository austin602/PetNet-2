var express = require ('express');
var router = express.Router ();

var adminRoutes = require ('./admin.js');
router.use ('/admin', adminRoutes);

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

    Post.findById (postId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to find post by id.';
            console.error ('*** ERROR: ' + errorMessage);
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


// // Create a route to delete a post by id.
// router.get ('/:id/delete', function (request, response) {
//     // response.send ('The post was deleted.');
//     var postId = request.params.id;
//
//     Post.findByIdAndRemove (postId, function (error, result) {
//         if (error) {
//             // ...
//         }
//         else {
//             if (request.sendJson) {
//                 response.json ({
//                     message: 'post was deleted.'
//                 })
//             }
//             else {
//                 response.redirect ('/post');
//             }
//         }
//     })
// });
// Export the router for use outside of module.
module.exports = router;
