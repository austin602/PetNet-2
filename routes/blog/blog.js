var express = require ('express');
var router = express.Router ();

var adminRoutes = require ('./admin.js');
router.use ('/admin', adminRoutes);

// Load the Post and Comment schema object.
var Blog = require ('../../model/blog.js');

// Route to view my posts.
router.get ('/', function (request, response) {

    Blog.find ({}, function (error, result) {
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
                response.render ('blog/list', {
                    data: {
                        blogList: result
                    }
                });
            }
        }
    });
});


// Route to grab a specific item by it's id.
router.get ('/:id', function (request, response) {
    // Grab the post id by the ':id' value in the url path.
    var blogId = request.params.id;

    Blog.findById (blogId)
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
                response.render ('blog/view', {
                    data: {
                        blog: result
                    }
                });
            }
        }
    });
});

module.exports = router;
