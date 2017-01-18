namespace App {
    let app = angular.module('App', ['ui.router']);

    app.config(['$stateProvider',
        ($stateProvider: angular.ui.IStateProvider)=>{
            console.log($stateProvider);
            $stateProvider
                .state('home', {
                    url:'/home',
                    // template: 'This is the angular home page.'
                    templateUrl:'/templates/partials/home1.html'
                })
            ;
        }
    ]);
}
