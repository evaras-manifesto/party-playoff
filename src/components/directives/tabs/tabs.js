app.component('tabsComponent', {
    templateUrl: 'tabs.html',
    controllerAs: '$ctrl',
    transclude: {
        tabs: '?tabs'
    },
    bindings: {
        icons: '='
    },
    controller: class tabsComponent {

        isActive(index) {
            return this.currentTab == index;
        };

        setTab(index) {
            console.log(index);

            if (index < 0) index = 0;
            if (index > this.icons.length - 1) index = this.icons.length - 1;
            this.currentTab = index;
            this.$timeout(() => this.$scope.$apply());
        };

        moveTabs() {
            return {transform: `translateX(-${this.currentTab}00vw)`}
        };

        constructor($rootScope, $element, $scope, $timeout) {
            this.$timeout = $timeout;
            this.$element = $element;
            this.$scope = $scope;
            this.currentTab = 0;
            $rootScope.$on('setTab', (event, value) => this.setTab(value));

        };

        $onInit() {
            console.log(this);

            var myElement = this.$element.get(0);
            var mc = new Hammer(myElement);

            mc.on("swipeleft", (ev) => {
                console.log(ev.type + " gesture detected.");
                this.setTab(this.currentTab + 1);
            });

            mc.on("swiperight", (ev) => {
                console.log(ev.type + " gesture detected.");
                this.setTab(this.currentTab - 1);
            });
        };
    }
});