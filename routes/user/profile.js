var express = require('express');

var router = express.Router();

var User = require('../../model/user.js');
var Pets = require('../../model/pets.js');

router.get('/', function(request, response) {
    // console.log('session: ', request.session.user.username);
if (request.session.user){
    User.findOne({
            username: request.session.user.username
        })
        .populate('pets')
        .exec(function(error, result) {
            if (error) {
                var errorMessage = 'Unable to load user data from username: ' //, request.session.user.username;
                console.error('***ERROR: ', errorMessage);
                response.send(errorMessage);
            } else {
                if (request.sendJson) {
                    response.json(result);
                } else {
                    console.log('*****RESULT: ', result.pets);
                    response.render('profile', {
                        data: {
                            user: result,
                            info: result.pets
                        }
                    });
                }
            }
        });
    } else {
        response.redirect('/user/login');
    }
});

// Route to add a new pet to an existing user
router.get('/addpet', function(request, response) {
    var list = [{
            value: 'Dog'
        },
        {
            value: 'Cat'
        },
        {
            value: 'Bird'
        },
        {
            value: 'Reptile'
        }
    ];

    var key, item;
    for (key in list) {
        // Grab the item in the list.
        item = list[key];
    }

    response.render('profile/editpet', {
        data: {
            title: 'Add Pet',
            method: 'POST',
            typeList: list
        }
    });
});


router.post('/pets', function(request, response) {
    // console.log('***Input Received: ', request.body);

    var updateUser = request.session.user;
    var newPet = Pets(request.body);

    newPet.save(function(error, savedPet) {
        if (error) {
            var errorMessage = 'Unable to save pet to the database';
            console.error('***ERROR: ', errorMessage);
            console.error(error);
            response.send(errorMessage);
        } else {
            User.findOneAndUpdate(updateUser, {
                $push: {
                    pets: savedPet
                }
            }, function(error, result) {
                if (error) {
                    console.error('***ERROR: Unable to save pet schema to user schema');
                    response.send(error);
                } else {
                    if (request.sendJson) {
                        response.json({
                            message: "User updated with pet data"
                        });
                    } else {
                        console.log('Pet was successfully linked to user.', result);
                        response.redirect('/profile/');
                    }
                }
            });
        }
    });

});

// Get a specific user by ID
router.get('/user/:id', function(request, response) {
    // console.log('***TEST:', request.params.id);
    var userId = request.params.id;

    User.findById(userId, function(error, result) {
        if (error) {
            console.error('There was an error retreiving this user by id.');
            response.send('There was an error retreiving this user by id.');
        }
        else {
            console.log('Found user: ', result);
            response.render('profile/edituser', {
                data: {
                    user: result
                }
            });
        }
    });
});

// Update user profile data
router.put ('/user/:id', function(request, response){
    var userId = request.params.id;
    // console.log('****TEST: ', request.body);
    User.findByIdAndUpdate (userId, request.body, function(error, result) {
        if (error) {
            console.error('There was an error updating user information.');
            console.error(error);
        }
        else {
            if (request.sendJson) {
                response.Json ({
                    message: "User was updated successfully"
                });
            }
            else {
                response.redirect('/profile/');
            }
        }
    });
});

// Get a specific pet by ID
router.get('/pets/:id', function(request, response) {
    var petId = request.params.id;
    console.log(petId);

    Pets.findById(petId, function(error, result) {
        if (error) {
            console.error('There was an error retreiving this pet by id');
            response.send('There was an error retreiving this pet by id');
        }
        else {
            console.log('Found pet: ', result);
            response.render('profile/viewpet', {
                data: {
                    pet: result
                }
            });
        }
    });

});

// Show edit pet form
router.get('/pets/:id/edit', function(request, response) {
    var petId = request.params.id;

    Pets.findById (petId, function(error, result) {
        if (error) {
            var errorMessage = 'Unable to find pet by id: ' + petId;
            console.error('***ERROR: ', errorMessage);
            response.send(errorMessage);
        }
        else {
            var list = [
                {value: 'Dog'},
                {value: 'Cat'},
                {value: 'Bird'},
                {value: 'Reptile'}
            ]

            var key, item;
            for (key in list) {
                item = list [key];

                if (result.type.toLowerCase () == item.value.toLowerCase ()) {
                    // Set that the type is selected.
                    item.selected = 'selected';
                }
            }

            response.render('profile/editpet', {
                data: {
                    title: 'Edit Pet Info',
                    method: 'PUT',
                    pets: result,
                    typeList: list
                }
            });
        }
    });
});

// update existing pet data
router.put('/pets/:id', function(request, response) {
    var petId = request.params.id;
    console.log(petId);

    Pets.findByIdAndUpdate (petId, request.body, function (error, result) {
        if (error) {
            console.error('***ERROR: Unable to update pet', error);
        }
        else {
            if (request.sendJson) {
                response.json({
                    message:"Pet entry was updated."
                });
            }
            else {
                response.redirect('/profile/pets/'+ petId);
            }
        }
    });
});




module.exports = router;
