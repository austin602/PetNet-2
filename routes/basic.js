var express = require('express');

var router = express.Router();

router.get('/', function(request, response) {
    response.render('home', {
        data: {
            user: request.session.user
        }
    });
});

router.get ('/admin', function (request, response) {
    response.render ('home')
});

router.get ('/profile/', function(request, response) {
    response.render('profile', {
        data: {
            user: request.session.user
        }
    });
});

module.exports = router;
