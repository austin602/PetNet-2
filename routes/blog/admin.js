var express = require ('express');
var router = express.Router ();

var Blog = require ('../../model/blog.js');
var Comment = require ('../../model/comment.js');

// router.use (function (request, response, next) {
//     var user = request.session.user;
//     console.log ('***User', user)
//     if (user && user.type == 'admin') {
//         next ();
//     }
//     else {
//         request.flash ('error', 'Access forbidden.');
//         response.redirect ('/error');
//     }
// });

router.get ('/create', function (request, response) {
    // response.send ('This is the post creation page.');
    response.render ('blog/edit', {
        data:{
            title: 'Add Post',
            method: 'POST'
        }
    });
});

router.post ('/', function (request, response) {

    var newBlog = Blog (request.body);

    console.log ("body: ", newBlog);

    newBlog.save (function (error, result) {
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
            response.redirect ('/blog');
        }

    });

});

router.get ('/:id/edit', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var blogId = request.params.id;

    // Run a query for our post by an id.
    Blog.findById (blogId, function (error, result) {
        if (error) {
            var errorMessage = ('UNable to find post by id: ' + postId);
            console.error ('*** ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            response.render ('blog/edit', {
                data: {
                    title: 'Edit post',
                    method: 'PUT',
                    blog: result
                }
            });
        }
    });
});

// Create a route to handle updating an existing post.
router.put ('/:id', function (request, response) {
    var blogId = request.params.id;

    Blog.findByIdAndUpdate (
        // id to search by
        blogId,

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
                    response.redirect ('/blog/' + blogId);
                }
            }
        }
    );
});

// Create a route to delete a post by id.
router.get ('/:id/delete', function (request, response) {
    // response.send ('The post was deleted.');
    var blogId = request.params.id;

    Blog.findByIdAndRemove (blogId, function (error, result) {
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
                response.redirect ('/blog');
            }
        }
    })
});

// Create a route to save comments.
router.post ('/:id/comment', function (request, response) {
    var blogId = request.params.id

    Blog.findById ( blogId, function (error, post) {
        if (error) {
            var errorMessage = 'unable to create' + blogId
            console.log('****error: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            var comment = Comment (request.body);

            var user = request.session.user;
            comment.author = user;

            comment.save (function (error, result) {
                if (error) {
                    var errorMessage = 'unable to save' + postId
                    console.log('****error: ' + errorMessage);
                    response.send (errorMessage);
                }
                else {
                    post.comments.push (comment);

                    post.save (function (error, postResult) {
                        // response.send ('saving the message')
                        response.redirect ('/blog/' + blogId)
                    });
                }
            });
        }
    });
});

module.exports = router;
