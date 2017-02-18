app.controller('VotingHomeScreen', class VotingScreen {

    addGame() {
        socketReq('addGame', {username: this.Settings.username})
            .then((data) => {
                console.info('addGame', data);
                this.$state.go('voting-game', {gameId:data._id});
            });
    }

    getAllGames() {
        socketReq('getAllGames', {username: this.Settings.username})
            .then((data) => {
                console.info('getAllGames', data);
                this.games = data;
                this.$scope.$apply();
            });
    }

    constructor(Settings, $scope, $state) {
        this.Settings = Settings;
        this.$scope = $scope;
        this.$state = $state;
        this.games = [];
    }

    $onInit() {
        console.log(this);

        this.getAllGames();

    }
});



