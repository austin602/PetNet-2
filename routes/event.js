var express = require ('express');
var router = express.Router ();

var Event = require ('../model/event.js');

router.get ('/create', function (request, response) {
    // response.send ('This is the event create page.');
    if (request.session.user) {
        response.render ('event/edit', {
            data: {
                title: 'Create Event',
                method: 'POST'
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});
//NOTE:saves new event.
router.post ('/', function (request, response) {
    var newEvent = Event (request.body);

    console.log ("body: ", newEvent);

    newEvent.save (function (error) {

        if (error) {
            var errorMessage = 'Unable to save the event.';
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            request.flash ('success', 'Event was created.');
            response.redirect ('/event');
        }
    });
});

router.get ('/', function (request, response) {
    if (request.session.user){
        Event.find ({}, function (error, result) {
            if (error) {
                var errorMessage = 'Unable to load event.';
                console.error ('***ERROR: ' + errorMessage);
                response.send (errorMessage);
            }
            else {

                if (request.sendJson) {
                    response.json (result);
                }
                else {
                    response.render ('event/list', {
                        data: {
                            eventList: result
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

router.get ('/:id', function (request, response) {
    var eventId = request.params.id;
    if(request.session.user) {
        Event.findById (eventId, function (error, result) {
            if (error) {
                var errorMessage = 'Unable to find event by id.';
                console.error ('***ERROR: ' + errorMessage);
                response.send (errorMessage);
            }
            else {
                if(request.sendJson) {
                    response.json(result)
                }
                else {
                    response.render ('event/view', {
                        data: {
                            events : result
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

router.get ('/:id/edit', function (request, response) {
    var eventId = request.params.id;
    if(request.session.user) {
        Event.findById (eventId, function (error, result) {
            if (error) {
                var errorMessage = 'Unable to edit event by id: ' + eventId;
                console.error ('*** ERROR: ' + errorMessage);
                response.send (errorMessage);
            }
            else {
                response.render ('event/edit', {
                    data: {
                        title: 'Edit event',
                        method: 'PUT',
                        events : result
                    }
                });
            }
        });
    }
    else {
        response.redirect('user/login');
    }
});

router.put ('/:id', function (request, response) {
    var eventId = request.params.id;
    if(request.session.user) {
        Event.findByIdAndUpdate (

            eventId,

            request.body,

            function (error, result) {
                if (error) {
                    // ...
                }
                else {
                    if (request.sendJson) {
                        response.json ({
                            message: 'event was updated'
                        });
                    }
                    else {
                        response.redirect ('/event/' + eventId);
                    }
                }
            }
        );
    }
    else {
        response.redirect('user/login');
    }
});

router.get ('/:id/delete', function (request, response) {

    var eventId = request.params.id;
    if(request.session.user) {
        Event.findByIdAndRemove (
            eventId, function (error, result) {
            if (error) {
                // ...
            }
            else {
                if (request.sendJson) {
                    response.json ({
                        message: 'event was deleted.'
                    })
                }
                else {
                    response.redirect ('/event');
                }
            }
        })
    }
    else {
        response.redirect('user/login');
    }
});
module.exports = router;
