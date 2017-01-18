namespace App {
    export class EventsController {
        static $inject = ['$state', '$stateParams', 'EventsService'];

        private stateService;
        private stateParamsService;
        private eventsService;

        public list;
        public individual;

        constructor($state: angular.ui.IStateProvider, $stateParams: angular.ui.IStateParamsService, eventsService: App.EventsService) {
            console.log('Events controller has loaded...');

            this.stateService = $state;
            this.stateParamsService = $stateParams;
            this.eventsService = eventsService;
        }

        public read(_id) {
            this.eventsService.read(_id)
            .success((response)=>{
                if (_id){
                    this.individual = response;
                    console.log('- Individual Forum Post found by id: ' + _id);
                    console.log('Response: ', response);
                }
                else {
                    console.log(response);
                    this.list = response;
                    console.log('- Forum list has been loaded', this.list);
                }
            })
            .error((response)=>{
                console.error('Unable to read forum posts: ', response);
            });
        }
    }
}
