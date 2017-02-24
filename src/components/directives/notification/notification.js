app.component('notificationComponent', {
    templateUrl: 'notification.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: class notificationComponent {

        constructor (Notifications) {
            this.Notifications = Notifications;
        }
        
        $onInit() {
          console.log('notificationComponent', this);
        }
    }
});