var express = require ('express');
var router = express.Router ();

var Post = require ('../../model/post.js');

router.use (function (request, response, next) {
    var user = request.session.user;
    console.log ('***User', user)
    if (user && user.type == 'admin') {
        next ();
    }
    else {
        request.flash ('error', 'Access forbidden.');
        response.redirect ('/error');
    }
});

router.get ('/create', function (request, response) {
    response.send ('This is the post creation page.');
    // response.render ('post/edit', {
    //     data:{
    //         title: 'Add Post',
    //         method: 'POST'
    //     }
    // });
});

router.post ('/', function (request, response) {

    var newPost = Post (request.body);

    console.log ("body: ", newPost);

    newPost.save (function (error, result) {
        if (error) {
            var errorMessage = 'Unable to save post.';
            console.error ('*** ERROR: ' + errorMessage);
            console.log(error);
            response.send (errorMessage);
        }
        else {
            // Add a flash message of our success.
            request.flash ('success', 'post was created.');

            // Redirect back to the post create page.
            response.redirect ('/post');
        }

    });

});

router.get ('/:id/edit', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var postId = request.params.id;

    // Run a query for our post by an id.
    Post.findById (postId, function (error, result) {
        if (error) {
            var errorMessage = ('UNable to find post by id: ' + postId);
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            response.render ('post/edit', {
                data: {
                    title: 'Edit post',
                    method: 'PUT',
                    post: result
                }
            });
        }
    });
});

// Create a route to handle updating an existing post.
router.put ('/:id', function (request, response) {
    var postId = request.params.id;

    Post.findByIdAndUpdate (
        // id to search by
        postId,

        // What needs to be udpdated.
        request.body,

        // Callback function.
        function (error, result) {
            if (error) {
                // ... Error goes here...
            }
            else {
                if (request.sendJson) {
                    response.json ({
                        message: 'post was updated.'
                    });
                }
                else {
                    // response.send ('The post has been updated: ' + postId);

                    // Redirect back to the specific post so we
                    // can confirm the changes to the post.
                    response.redirect ('/post/' + postId);
                }
            }
        }
    );
});

// Create a route to delete a post by id.
router.delete ('/:id', function (request, response) {
    // response.send ('The post was deleted.');
    var postId = request.params.id;

    Post.findByIdAndRemove (postId, function (error, result) {
        if (error) {
            // ...
        }
        else {
            if (request.sendJson) {
                response.json ({
                    message: 'post was deleted.'
                })
            }
            else {
                response.redirect ('/post');
            }
        }
    })
});
module.exports = router;
