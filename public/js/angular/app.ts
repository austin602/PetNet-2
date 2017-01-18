namespace App {
    let app = angular.module('App', ['ui.router']);

    app.config(['$stateProvider',
        ($stateProvider: angular.ui.IStateProvider)=>{
            $stateProvider
                .state('events', {
                    url:'/events',
                    templateUrl:'/templates/partials/events.html',
                    controller: App.EventsController,
                    controllerAs: 'eventsController'
                })
            ;
        }
    ]);
}
