app.service('Settings', class Settings {

    events() {
        this.$rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options) => {
            console.log('toState', toState);

            if (toState.name != 'home' && toState.name != 'settings') {
                if (this.username.length < 4) {
                    event.preventDefault();
                    this.$state.go('settings');
                }
            }
            // event.preventDefault();
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
        })
    }

    showHeader() {
        let name = this.$state.current.name;

        let show = true;

        if (name == 'home') {
            show = false;
        }

        if (this.username.length < 4) {
            show = false;
        }

        return show;
    }

    back() {
        let name = this.$state.current.name;

        if (name == 'voting-home') {
            this.$state.go('home');
        } else {
            this.$state.go('voting-home');
        }
    }

    constructor($state, $stateParams, $timeout, $mdToast, $rootScope) {
        this.username = '';
        this.$state = $state;
        this.$rootScope = $rootScope;

        this.events();

        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
        } else {
            this.$state.go('settings');
        }
    }
});

