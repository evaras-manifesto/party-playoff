app.controller('VotingHomeScreen', class VotingScreen {

    addGame() {
        socketReq('addGame', {username: this.Settings.username})
            .then((data) => {
                console.info('addGame', data);
                this.$state.go('voting-game', {gameId: data._id});
            });
    }

    getGame() {
        socketReq('getGame', {username: this.Settings.username, gameId: this.gameId})
            .then((data) => {
                if (data) {
                    this.$state.go('voting-game', {gameId: this.gameId});
                } else {
                    this.Notifications.show(`Game ${this.gameId} does not exist.`);
                }
                console.info('getGame', data);
                this.games = data;
                this.$scope.$apply();
            });
    }

    getMyGames() {
        socketReq('getMyGames', {username: this.Settings.username})
            .then((data) => {
                console.info('getMyGames', data);
                this.games = data;
                this.$scope.$apply();
            });
    }

    constructor(Settings, $scope, $state, Notifications) {
        this.Settings = Settings;
        this.$scope = $scope;
        this.$state = $state;
        this.Notifications = Notifications;
        this.games = [];
        this.gameId = "";
    }

    $onInit() {
        console.log(this);

        this.getMyGames();

    }
});



