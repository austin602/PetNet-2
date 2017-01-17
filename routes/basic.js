var express = require('express');

var router = express.Router();

router.get('/', function(request, response) {
    response.render('home');
});

router.get ('/admin', function (request, response) {
    response.render ('home');
});

router.get ('/about', function (request, response) {
    // response.send ('reached about page.');
    response.render ('about');
});

router.get ('/contact', function (request, response) {
    // response.send ('reached contact page.');
    response.render ('contact');
});
module.exports = router;
