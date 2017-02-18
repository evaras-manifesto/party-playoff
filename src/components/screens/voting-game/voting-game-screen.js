app.controller('VotingGameScreen', class VotingGameScreen {
    events() {
        socket.on('updateGame', (data) => {
            console.log('received updateGame', data);
            if (data.message) {
                this.$mdToast.show(this.$mdToast.simple()
                    .textContent(data.message)
                    .hideDelay(2000));
            }
            this.getGame();
        });
    }

    isStatus(status) {
        return this.game.status == status;
    }

    getTurn() {
        return this.game.currentRound % 3;
    }

    isTurn(player = this.getPlayer()) {
        return _.findIndex(this.game.players, player) == this.getTurn();
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

    joinGameRoom() {
        socketReq('joinGameRoom', {username: this.getPlayer(), gameId: this.$stateParams.gameId})
            .then((data) => {
                console.info('joinGameRoom', data);
                this.update();
            });
    }

    joinGame() {
        socketReq('joinGame', {username: this.getPlayer(), gameId: this.game._id})
            .then((data) => {
                console.info('joinGame', data);
                this.getGame();
            });
    }

    startGame() {
        socketReq('startGame', {username: this.getPlayer(), gameId: this.game._id})
            .then((data) => {
                console.info('startGame', data);
                this.getGame();
            });
    }

    getGame() {
        return socketReq('getGame', {username: this.Settings.username, gameId: this.$stateParams.gameId})
            .then((data) => {
                console.info('getGame', data);
                this.game = data;
                this.update();
            });
    }

    update() {
        this.$scope.$apply();
    }

    constructor(Settings, $scope, $stateParams, $mdToast) {
        this.Settings = Settings;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.$mdToast = $mdToast;
        this.game = {};
    }

    $onInit() {
        console.log(this);

        this.events();
        this.getGame();
        this.joinGameRoom();
    }
});



