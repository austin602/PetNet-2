var express = require ('express');
var router = express.Router ();

var Event = require ('../model/event.js');

router.get ('/create', function (request, response) {
    // response.send ('This is the event create page.');
    response.render ('event/edit', {
        data: {
            title: 'Create Event',
            method: 'POST'
        }
    });
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
});
router.get ('/:id', function (request, response) {
    var eventId = request.params.id;

    Event.findById (eventId, function (error, result) {
        if (error) {
            var errorMessage = 'Unable to find event by id.';
            console.error ('***ERROR: ' + errorMessage);
            response.send (errorMessage);
        }
        else {
            response.render ('event/view', {
                data: {
                    event: result
                }
            });
        }
    });
});

router.get ('/:id/edit', function (request, response) {
    var eventId = request.params.id;

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
                    event: result
                }
            });
        }
    });
});

router.put ('/:id', function (request, response) {
    var eventId = request.params.id;

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
});

router.get ('/:id/delete', function (request, response) {

    var eventId = request.params.id;

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
});
module.exports = router;
