var express = require ('express');

var router = express.Router();

var User = require('../../model/user.js');
var Pets = require('../../model/pets.js');

router.get ('/', function(request, response) {
    console.log('session: ', request.session);

    response.render('profile', {
        data: {
            user: request.session.user
        }
    });
});

router.get('/addpet', function(request, response) {
    var list =  [
        {value: 'Dog'},
        {value: 'Cat'},
        {value: 'Bird'},
        {value: 'Reptile'}
    ];

    var key, item;
    for (key in list) {
        // Grab the item in the list.
        item = list [key];
    }

    response.render('profile/editpet', {
        data: {
            title: 'Add Pet',
            method: 'POST',
            typeList: list
        }
    });
});

router.post('/addpet', function(request, response) {
    // console.log('***Input Received: ', request.body);

    var newPet = Pets(request.body);

    newPet.save (function(error, result) {
        if (error) {
            var errorMessage = 'Unable to save pet to the database';
            console.error('***ERROR: ', errorMessage);
            console.error(error);
            response.send(errorMessage);
        }
            else {
                    var updateUser = request.session.user;
                    User.pets = result;

                    console.log('****** USER PET DATA: ', User.pets);
                    console.log('****** updateUser: ', updateUser);

                    User.findOneAndUpdate(updateUser,{pets:User.pets}, function(error, result) {
                        if (error) {
                            console.error('***ERROR: Unable to save pet schema to user schema');
                            response.send(error);
                        }
                        else {
                            if (request.sendJson) {
                                response.json({
                                    message: "User updated with pet data"
                                });
                            }
                            else {
                                console.log('Pet was successfully linked to user.', result);
                                response.redirect('/profile/');
                            }
                        }
                    });
                }
    });
});





module.exports = router;
