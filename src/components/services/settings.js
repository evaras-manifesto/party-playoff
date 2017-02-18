app.service('Settings', class Settings {

    constructor ($state, $stateParams, $timeout, $http) {
        this.username;
        
        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
        }
    }

    $onInit() {

    }
});

