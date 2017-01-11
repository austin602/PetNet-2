var express = require ('express');

var router = express.Router();

var User = require('../../model/user.js');
var Pets = require('../../model/pets.js');

router.get ('/', function(request, response) {
    console.log('session: ', request.session.user.username);

    User.findOne({username:request.session.user.username})
    .populate('pets')
    .exec(function(error, result) {
        if (error) {
            var errorMessage = 'Unable to load user data from username: ' //, request.session.user.username;
            console.error('***ERROR: ', errorMessage);
            response.send(errorMessage);
        }
        else {
            if (request.sendJson) {
                response.json(result);
            }
            else {
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

    var updateUser = request.session.user;
    var newPet = Pets(request.body);

    newPet.save (function(error, savedPet) {
        if (error) {
            var errorMessage = 'Unable to save pet to the database';
            console.error('***ERROR: ', errorMessage);
            console.error(error);
            response.send(errorMessage);
        }
            else {
                    // var newPet = request.body;
                    // var updateUser = request.session.user;
                    // var petList = [];
                    // var pet;
                    // for (i = 0; i < 1; i++) {
                    //     pet = {
                    //         name: newPet.name,
                    //         type: newPet.type,
                    //         breed: newPet.breed,
                    //         bio: newPet.bio
                    //     }
                    //     petList.push(pet);
                    // }


                    // Pets.insertMany(newPet, function(error, savedPet) {
                    //     if (error) {
                    //         console.log('There was an error adding the pet list to the database.', error);
                    //         response.send('There was an error adding the pet list.');
                    //     }
                    //     else {
                    //         console.log('****** updateUser: ', updateUser);
                    //
                    //
                    //         console.log('****** USER PET DATA: ', savedPet);

                            User.findOneAndUpdate(updateUser,{$push: {pets:savedPet}}, function(error, result) {
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


                // }
    // });
});





module.exports = router;
