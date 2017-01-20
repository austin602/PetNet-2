namespace App {
    let app = angular.module('App');

    export class EventsService {
        static $inject = ['$http'];

        private httpService;

        constructor ($httpService: angular.IHttpService) {
            this.httpService = $httpService;
        }

        // NOTE: Post /event
        public create (event) {
            let promise = this.httpService ({
                url:'/event',
                method: 'POST',
                data: event,
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            return promise;
        }

        public read(id) {
            let url = '/event';

            if (id) {
                url = url + '/' + id;
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

        public update (id, event) {
            let promise = this.httpService({
                url:'/event/' + id,
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                data: event
            });
            return promise;
        }
    }
    app.service('EventsService', EventsService);
}
