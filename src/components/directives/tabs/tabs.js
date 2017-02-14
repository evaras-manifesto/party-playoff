app.component('tabsComponent', {
    templateUrl: 'tabs.html',
    controllerAs: '$ctrl',
    transclude: {
        tabs:'?tabs'
    },
    bindings: {
        icons:'='
    },
    controller: class tabsComponent {

        setTab(index) {
            console.log(index);
            return this.currentTab = index;
        };

        moveTabs() {
            return {transform: `translateX(-${this.currentTab}00vw)`}
        };

        constructor($rootScope) {
            this.currentTab = 0;
            $rootScope.$on('setTab', (event, value) => this.setTab(value));

        };

        $onInit() {
            console.log(this);
        };
    }
});