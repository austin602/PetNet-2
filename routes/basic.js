var express = require('express');

var router = express.Router();

router.get('/', function(request, response) {
    response.render('home', {
        data: {
            user: request.session.user
        }
    });
});

router.get ('/about', function (request, response) {
    // response.send ('reached about page.');
    response.render ('about');
});

router.get ('/contact', function (request, response) {
    // response.send ('reached contact page.');
    response.render ('contact');
});

router.get('/angular', function(request, response) {
    if(request.session.user){
        response.render ('home', {
            layout: 'index-angular'
        });
    }
    else {
        response.redirect('/user/login');
    }
});

module.exports = router;
