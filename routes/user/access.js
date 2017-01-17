var express = require('express');

var router = express.Router();

var User = require('../../model/user.js');

// var auth = function(request, response, next) {
//     if (request.session && request.session.user === 'testadmin' && request.session.admin) {
//     return next();
//     }
//     else {
//         return response.sendStatus(401);
//     }
// }

router.get('/login', function(request, response) {
    if (request.session.user) {
        response.redirect('/profile/');
    }
    else {
        response.render('login');
    }
});

router.post('/login', function(request, response) {
    User.findOne (
        {
            username: request.body.username,
            password: request.body.password
        },
        {},
        function(error, result) {
            if (error) {
                console.error('*** ERROR: Problem finding the user.');
                console.error(error);
                response.send('There was an error with the page');
            }
            else if (!result) {
                request.flash('error', 'Your username or password is not correct');
                console.log('***Test: ', request);
                response.redirect('login');
            }
            else {
                // console.log('This is the found user: ', result);

                request.session.user = {
                    username: result.username,
                    email: result.email
                }
                // console.log('This is the session data: ', request.session);

                response.redirect('/profile/');
            }
        }
    );
});

router.get('/register', function(request, response) {
    response.render('register');
});

// router.post('/register', function(request, response) {
//
//     var toList = [
//         {
//             email: request.body.email
//         },
//         {
//             email:'ahaddock523@gmail.com'
//         }
//     ]
//
//     var emailTitle = 'Welcome to PetNet.com';
//     var emailBody = 'Thanks for registering with PetNet. Your username is: ' + request.body.username + ', email: ' + request.body.email;
//
//     console.log('*****Email request: ', request.body.email);
//     // Create a user object from the User schema.
//     var newUser = User(request.body);
//
//     User.findOne(
//         {
//             username: request.body.username,
//             email: request.body.email
//         },
//         function(error, result) {
//             console.log('***RESULT: ', result);
//
//             if(error) {
//                 console.error('***ERROR registering user');
//                 console.error(error);
//             }
//             else if (result) {
//                 console.log('User already exists with this username or email, please try again.');
//                 request.flash('error', 'This username or email already exists. Please try again again.');
//                 response.redirect('/user/register');
//             }
//             else {
//                 newUser.save (function(error) {
//                     if(error) {
//                         var errorMessage = 'Unable to save the user to the database.'
//                         console.error('***ERROR: ', errorMessage);
//                         console.error(error);
//                         response.send(errorMessage);
//                     }
//                     else {
//
//                         // Send a confirmation email.
//                         // Load in the http request module
//                         var request = require('request');
//
//                         request.post(
//                             // Configuration of object with where to make the call.
//                             {
//                                 url:'https://api.sendgrid.com/v3/mail/send',
//                                 headers: {
//                                 'Authorization': 'Bearer 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',
//                                 'Content-Type': 'application/json'
//                             },
//
//                                 // The JSON form data to send with the request.
//                                 json: {
//
//                                     // The email subject and recipients.
//                                     personalizations: [
//                                         {
//                                             to: toList,
//                                             subject: emailTitle
//                                         }
//                                     ],
//                                     from: {
//                                         email: 'no-reply@petnet.com'
//                                     },
//                                     content: [
//                                         {
//                                             type: 'text/html',
//                                             value: emailBody
//                                         }
//                                     ]
//                                 }
//                             }
//                         )
//                         .on('response', function(requestReply) { // Pass a callback for when the 'response' event is fired.
//                             console.log('request reply: ', requestReply.statusCode);
//                             console.log ('Email sent and user registered.');
//
//                             response.redirect('login');
//                         })
//                         .on ('error', function(error) {
//                             response.error('There was a problem sending the registration email.');
//                         })
//                         ; // end of request
//                     }
//                 });
//             }
//         }
//     )
// });

// Check for existing user
// Create basic email title and body
// Add new user to database
// Send confirmation email to provided email

router.post ('/register', function (request, response) {
    // response.send ('New user');

    //Create the parts of the email.
    var toList = [
        {
            email: request.body.email
        },
        {
            email: 'ahaddock523@gmail.com'
        }
    ]

    var emailTitle = 'Welcome to PetNet';
    var emailBody = 'Thanks for registering ' + request.body.username + '! Make sure to create your profile and add your pets!';

    //create a user object from the User schema.
    var newUser = User (request.body);

    User.findOne ({ username: request.body.username, email: request.body.email}, function (error, result) {
        console.log ('***RESULT', result);
        if (error) {
            console.error ('***ERROR registering.');
            console.error (error);
        }
        else if (result) {
            console.log ('This username or email already exists. Please try registering again.');
            request.flash ('error', 'This username or email already exists. Please try registering again.');
            response.redirect ('/user/register');
        }

        else {
            newUser.save (function (error, result) {
                if (error) {
                    console.error ('***ERROR: Unable to save the user.');
                    console.error (error)
                }
                else {
                    console.log ('User was succesfully save to db: ', newUser);

                    //findOne will only return in terminal one user that is already in the database.
                        //I was having the problem of putting in non-user username and password and it would
                        //still go to the profile page. Now it will show the error message 'Unable to find the user'
                        //I had User.find first and it would return an empty array in the terminal
                        //because it was overwriting the callback function.
                        // User.findOne (
                        // {
                        //     username: request.body.username,
                        //     password: request.body.password
                        // },
                        //
                    //     function (error, foundUser) {
                    //         if (error) {
                    //             console.error ('***ERROR: Unable to find the user.');
                    //             console.error (error);
                    //         }
                    //         else {
                    //             console.log ('User found: ', foundUser);
                    //         }
                    //     }
                    // );

                    var httpRequest = require ('request');

                    //Make a request to the Sendgrid API service.
                    httpRequest.post (
                        //Pass the configuration object with where to make the call.
                        {
                            url: 'https://api.sendgrid.com/v3/mail/send',
                            headers: {
                                'Authorization': 'Bearer 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',
                                'Content-Type': 'application/json'
                            },

                            //The JSON or form data to send with the request.
                            json: {
                                //The email subject and recipients.
                                personalizations: [
                                    {
                                        //An array of objects so you can send to many different emails.
                                        to: toList,
                                        subject: emailTitle
                                    }
                                ],
                                from: {
                                    email: 'no-reply@register.com'
                                },
                                content: [
                                    {
                                        type: 'text/html',
                                        value: emailBody
                                    }
                                ]
                            }
                        }
                    )
                    .on ('response', function (requestReply) {
                        console.log ('request reply: ', requestReply.statusCode);
                        // request.flash ('success', 'You have registered! Please sign in.');
                        response.redirect ('/user/login');
                    })
                    .on ('error', function () {
                        response.error ('There was a problem sending the registration email.');
                    })
                    ;
                }
            });
        }
    });


});

router.get('/logout', function(request, response) {
    request.session.destroy();

    response.redirect('/user/login');
});

module.exports = router;
