app.service('Settings', class Settings {

    showHeader() {
        let name = this.$state.current.name;

        let show = true;

        if (name == 'home') {
            show = false;
        }

        if (this.username.length < 3) {
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

    constructor ($state, $stateParams, $timeout, $http) {
        this.username = '';
        this.$state = $state;

        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
        } else {
            this.$state.go('settings');
        }
    }
});

