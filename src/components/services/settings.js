app.service('Settings', class Settings {

    back() {
        console.log('$state.current.name', this.$state.current.name);
        var name = this.$state.current.name;

        if (name == 'voting-game') {
            this.$state.go('voting-home');
        } else {
            this.$state.go('home');
        }
    }

    constructor ($state, $stateParams, $timeout, $http) {
        this.username;
        this.$state = $state;


        
        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
        }
    }
});

