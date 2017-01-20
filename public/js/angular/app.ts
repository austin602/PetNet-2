namespace App {
    let app = angular.module('App', ['ui.router']);

    app.config(['$stateProvider',
        ($stateProvider: angular.ui.IStateProvider)=>{

            console.log($stateProvider);
            $stateProvider
                .state('events', {
                    url:'/events',
                    templateUrl:'/templates/partials/events.html',
                    controller: App.EventsController,
                    controllerAs: 'eventsController'
                })
                .state('events-create', {
                    url:'/events/create',
                    templateUrl:'/templates/partials/events/edit.html',
                    controller: App.EventsController,
                    controllerAs: 'eventsController'
                })
                .state('events-edit', {
                    url:'/events/:id',
                    templateUrl:'/templates/partials/events/edit.html',
                    controller: App.EventsController,
                    controllerAs: 'eventsController'
                })
                .state('events-view', {
                    url:'/events/:id',
                    templateUrl: '/templates/partials/events/view.html',
                    controller: App.EventsController,
                    controllerAs: 'eventsController'
                })
            ;
        }
    ]);
}
