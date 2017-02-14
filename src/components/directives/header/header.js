app.component('headerComponent', {
    templateUrl: 'header.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: class headerComponent {

        constructor() {}
        
        $onInit() {
            console.log('header')
        }
    }
});
