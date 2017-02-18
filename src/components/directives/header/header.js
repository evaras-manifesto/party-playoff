app.component('headerComponent', {
    templateUrl: 'header.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: class headerComponent {

        constructor(Settings) {
            this.Settings = Settings;
        }
        
        $onInit() {
            console.log(this, 'header');
        }
    }
});
