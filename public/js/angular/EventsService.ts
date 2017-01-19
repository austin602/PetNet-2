namespace App {
    let app = angular.module('App');

    export class EventsService {
        static $inject = ['$http'];

        private httpService;

        constructor ($httpService: angular.IHttpService) {
            this.httpService = $httpService;
        }

        public read(_id) {
            let url = '/event';

            if (_id) {
                url = url + '/' + _id;
            }

            let promise = this.httpService({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: {}
            });
            return promise;
        }
    }
    app.service('EventsService', EventsService);
}
