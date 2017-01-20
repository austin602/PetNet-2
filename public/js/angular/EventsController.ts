namespace App {
    export class EventsController {
        static $inject = ['$state', '$stateParams', 'EventsService'];

        private stateService;
        private stateParamsService;
        private eventsService;

        public list;
        public event;
        public mode;

        constructor($state: angular.ui.IStateProvider, $stateParams: angular.ui.IStateParamsService, eventsService: App.EventsService) {
            console.log('Events controller has loaded...');

            this.stateService = $state;
            this.stateParamsService = $stateParams;
            this.eventsService = eventsService;

            // Pulling information so it can be read by id
            if (this.stateParamsService.id) {
                this.read(this.stateParamsService.id);
            }
            console.log('STATE SERVICE: ==========', this.stateService.current.name);            if(this.stateService.current.name == 'events-edit') {
                this.mode = 'Edit';
            }
            else if (this.stateService.current.name == 'events-create') {
                this.mode = 'Create';
            }
        }

        public create(id) {
            if(id) {
                this.update(id);
            }
            else {
                console.log('CREATE EVENT BUTTON');
                this.eventsService.create(this.event)
                .success((response)=>{
                    this.stateService.go('events');
                })
                .error((response)=>{
                    console.error('Unable to create the event:', response);
                });
            }
        }

        public read(id) {
            this.eventsService.read(id)
            .success((response)=>{
                if (id){
                    this.event = response;
                    console.log('- Individual Forum Post found by id: ' + id);
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

        public goToPage(route, data) {
            console.log('Here is the route data...', route, data);
            this.stateService.go(route, data);
        }

        public update (id) {
            this.eventsService.update (id, this.event)
            .success((response)=>{
                this.goToPage ('events-view', {id: id});
            })
            .error((response)=>{
                console.error('Unable to update event: ', response)
            });
        }

        public delete (id) {
            console.log('Deleted event by id: ', id);

            this.eventsService.delete(id)
                .success((response)=>{
                    console.log('Event successfully delete', response);

                    this.stateService.go ('events');
                })
                .error ((response)=>{
                    console.error('ERROR: unable to delete event', response)
                });
        }
    }
}
