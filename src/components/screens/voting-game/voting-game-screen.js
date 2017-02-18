app.controller('VotingGameScreen', class VotingGameScreen {
    events() {

    }

    getPlayer() {
        return this.Settings.username;
    }

    isHost(player = this.getPlayer()) {
        return player == this.game.host;
    }

    canStart() {
        return this.isHost() && this.game.players.length > 2;
    }

    hasJoined(player = this.getPlayer()) {
        return _.includes(this.game.players, player);
    }

    joinGame() {
        socketReq('joinGame', {username: this.Settings.username, gameId:this.$stateParams.gameId})
            .then((data) => {
                console.info('joinGame', data);
                this.update();
            });
    }

    getGame() {
        socketReq('getGame', {username: this.Settings.username, gameId:this.$stateParams.gameId})
            .then((data) => {
                console.info('getGame', data);
                this.game = data;
                this.update();
            });
    }

    update() {
        this.$scope.$apply();
    }

    constructor(Settings, $scope, $stateParams) {
        this.Settings = Settings;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.game = {};
    }

    $onInit() {
        console.log(this);

        this.events();
        this.getGame();
    }
});



