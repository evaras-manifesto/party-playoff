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
            this.$scope.$apply();
        };

        moveTabs() {
            return {transform: `translateX(-${this.currentTab}00vw)`}
        };

        constructor($rootScope, $element, $scope) {
            this.$element = $element;
            this.$scope = $scope;
            this.currentTab = 0;
            $rootScope.$on('setTab', (event, value) => this.setTab(value));

        };

        $onInit() {
            console.log(this);

            var myElement = this.$element.get(0);

// create a simple instance
// by default, it only adds horizontal recognizers
            var mc = new Hammer(myElement);

// listen to events...
//             mc.on("swipe tap press", function (ev) {
//                 console.log(ev.type + " gesture detected.");
//             });

            mc.on("swipeleft", (ev) => {
                console.log(ev.type + " gesture detected.");
                this.setTab(this.currentTab + 1);
            });

            mc.on("swiperight", (ev) => {
                console.log(ev.type + " gesture detected.");
                this.setTab(this.currentTab - 1);
            });

            // var hammertime = new Hammer(this.$element, {});

            // $('body').hammer({}).bind('swipeleft', (ev) => {
            //     this.setTab(this.currentTab - 1);
            //     console.log(ev);
            // });
            // this.$element.hammer({}).bind('swiperight', (ev) => {
            //     this.setTab(this.currentTab + 1);
            //     console.log(ev);
            // });
        };
    }
});