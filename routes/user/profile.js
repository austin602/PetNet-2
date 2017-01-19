var express = require('express');

var router = express.Router();

var User = require('../../model/user.js');
var Pets = require('../../model/pets.js');

// NOTE: adding multer to edit profile picture
var multer = require('multer');
var processUploadFile = multer({ dest: './temp'});


router.get('/', function(request, response) {
    // console.log('session: ', request.session.user.username);
    if (request.session.user) {
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
                        console.log('*****RESULT: ', result);
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
    if (request.session.user){
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
    }
    else {
        response.redirect('user/login');
    }
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
    if (request.session.user){
        User.findById(userId, function(error, result) {
            if (error) {
                console.error('There was an error retreiving this user by id.');
                response.send('There was an error retreiving this user by id.');
            } else {
                console.log('Found user: ', result);
                response.render('profile/edituser', {
                    data: {
                        user: result
                    }
                });
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});

// Update pet profile images
router.get('/pets/:id/:type/pic', function(request, response) {
    var petId = request.params.id;
    if(request.session.user) {

        Pets.findById(petId, function(error, result) {
            if(error) {
                console.error('****ERROR: cannot find pet by id.');
                response.send('Error finding pet by id');
            }
            else {
                if (request.sendJson) {
                    response.Json(result);
                }
                else {
                    response.render('profile/pet-pic', {
                        data: {
                            method: 'PUT',
                            pet: result
                        }
                    });
                }
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});

router.post('/pets/:id/:type/pic', processUploadFile.single('imageFile'),
function(request, response) {
    console.log('***TEST: ', request.params.type);
    var petId = request.params.id;

    if (request.file) {
        console.log('file: ', request.file);
        console.log('path: ', request.file.path);

        var fs = require('fs-extra');
        var source = request.file.path;
        var basePath = './public';
        var destination = '/img/uploads/' + request.file.originalname;

        fs.move(source, (basePath + destination), function(error) {
            fs.remove(source, function(error) {
            })
        })
        request.body.imageUrl = destination;
    }
    else {
        if (request.params.type == 'Dog') {
            request.body.imageUrl = '/img/uploads/defaultdog.png'
        }
        else if (request.params.type == 'Cat') {
            request.body.imageUrl = '/img/uploads/defaultcat.png'
        }
        else if (request.params.type == 'Bird') {
            request.body.imageUrl = '/img/uploads/defaultbird.png'
        }
        else if (request.params.type == 'Reptile') {
            request.body.imageUrl = '/img/uploads/defaultreptile.png'
        }
    }
    console.log('Pet Image url: ', request.body.imageUrl);
    Pets.findByIdAndUpdate(petId, request.body, function(error, result) {
        if(error) {
            console.error('***ERROR: unable to update pet with imageUrl', error);
            response.send('Cannot update pet with imageUrl');
        }
        else {
            console.log('---------------------', result);
            response.redirect('/profile/');
        }
    });
})

// Update user profile image
router.get('/user/:id/pic', function(request, response) {
    var userId = request.params.id;
    if(request.sesison.user) {
        User.findById(userId, function(error, result) {
            if (error) {
                console.error('***ERROR: cannot find user by id');
                response.send('Error finding user by id');
            }
            else {
                if (request.sendJson) {
                    response.Json(result);
                }
                else {
                    response.render('profile/user-pic', {
                        data: {
                            method: 'PUT',
                            user: result
                        }
                    });
                }
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});

router.post('/user/:id/pic', processUploadFile.single('imageFile'), function(request, response) {
    var userId = request.params.id;

    if (request.file) {

        console.log('file:', request.file);
        console.log('path: ', request.file.path);

        var fs = require('fs-extra');
        var source = request.file.path;
        var basePath = './public';
        var destination = '/img/uploads/' + request.file.originalname;

        fs.move (source, (basePath + destination), function(error) {
            fs.remove (source, function(error) {
            })
        })
        request.body.imageUrl = destination;
    }
    else {
        request.body.imageUrl = '/img/uploads/defaultuser.png'
    }
    console.log('Image url:', request.body.imageUrl);
    User.findByIdAndUpdate(userId, request.body, function(error, result) {
        if(error) {
            console.error('***ERRROR: unable to update user with imageUrl', error);
            response.send('Cannot update user with imageUrl');
        }
        else {
            console.log('-------------------------',result);
            response.redirect('/profile/')
        }
    });
});

// Update user profile data
router.put('/user/:id', function(request, response) {
    var userId = request.params.id;

    // console.log('****TEST: ', request.body);
    User.findByIdAndUpdate(userId, request.body, function(error, result) {
        if (error) {
            console.error('There was an error updating user information.');
            console.error(error);
        } else {
            if (request.sendJson) {
                response.Json({
                    message: "User was updated successfully"
                });
            } else {
                response.redirect('/profile/');
            }
        }
    });
});

// Get a specific pet by ID
router.get('/pets/:id', function(request, response) {
    var petId = request.params.id;
    console.log(petId);

    if (request.session.user){
        Pets.findById(petId, function(error, result) {
            if (error) {
                console.error('There was an error retreiving this pet by id');
                response.send('There was an error retreiving this pet by id');
            } else {
                console.log('Found pet: ', result);
                response.render('profile/viewpet', {
                    data: {
                        pet: result
                    }
                });
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});

// Show edit pet form
router.get('/pets/:id/edit', function(request, response) {
    var petId = request.params.id;
    if(request.session.user){
        Pets.findById(petId, function(error, result) {
            if (error) {
                var errorMessage = 'Unable to find pet by id: ' + petId;
                console.error('***ERROR: ', errorMessage);
                response.send(errorMessage);
            } else {
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
                ]

                var key, item;
                for (key in list) {
                    item = list[key];

                    if (result.type.toLowerCase() == item.value.toLowerCase()) {
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
    }
    else {
        response.redirect('user/login');
    }
});

// update existing pet data
router.put('/pets/:id', function(request, response) {
    var petId = request.params.id;
    console.log(petId);

    Pets.findByIdAndUpdate(petId, request.body, function(error, result) {
        if (error) {
            console.error('***ERROR: Unable to update pet', error);
        } else {
            if (request.sendJson) {
                response.json({
                    message: "Pet entry was updated."
                });
            } else {
                response.redirect('/profile/pets/' + petId);
            }
        }
    });
});

router.get('/pets/:id/delete', function(request, response) {
    var petId = request.params.id;
    // console.log('Delete pet by id: ', petId);
    if (request.session.user) {
        User.findOneAndUpdate(request.session.user.username, {
            $pop: {
                pets: petId
            }
        }, function(error, removedPet) {
            if (error) {
                console.error('***ERROR: Unable to remove pet id from user data.', error);
                response.send(error)
            } else {
                console.log('Pet was successfully delete from User database by id.');
                Pets.findByIdAndRemove(removedPet, function(error, result) {
                    if (error) {
                        console.error('***ERROR: Unable to remove pet ID from user database.');
                        response.send(error);
                    } else {
                        console.log('Pet was successfully removed from user.');
                        response.redirect('/profile/');
                    }
                })
            }
        });
    } else {
        response.redirect('user/login');
    }

});

// route for displaying the pet owner category page
router.get('/search', function(request, response) {
    if (request.session.user) {
        // User.find({}, function(error, result) {
        //     if (error) {
        //         console.error('***ERROR: unable to retrieve user data', error);
        //     }
        //     else {
        //         response.render('profile/search', {
        //             data: {
        //                 user: result
        //             }
        //         });
        //     }
        // });
        response.render('profile/search');
    } else {
        response.redirect('/user/login');
    }
});

// route to search for users by petType and render results on callback
router.get('/search/:petType', function(request, response) {
    console.log('***TEST: ', request.params.petType);
    var petType = request.params.petType;
    if (request.session.user) {
        User.find({
            petType
        }, function(error, result) {
            if (error) {
                console.error('***ERROR: Unable to retrieve users by petType', error);
            } else {
                console.log('********************', result);
                response.render('profile/searchlist', {
                    data: {
                        title: 'Results for ' + petType + ' owners',
                        user: result
                    }
                });
            }
        });
    } else {
        response.redirect('/user/login')
    }
});

// route to view specific user profile by id after search by petType
router.get('/search/user/:id', function(request, response) {
    var userId = request.params.id
    // console.log('***********USER REQUEST: ', request.params);
    if (request.session.user) {
        User.findById(userId)
            .populate('pets')
            .exec(function(error, result) {
                if (error) {
                    console.error('***ERROR: ', error);
                    response.send(error);
                } else {
                    if (request.sendJson) {
                        response.json(result);
                    } else {
                        console.log('***Successfully located user by id: ', userId);
                        response.render('profile/viewprofile', {
                            data: {
                                user: result,
                                info: result.pets
                            }
                        });
                    }
                }
            });
    }
});


module.exports = router;
