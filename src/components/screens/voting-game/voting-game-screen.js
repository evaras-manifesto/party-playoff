app.controller('VotingGameScreen', class VotingGameScreen {
    events() {
        socket.removeListener('updateGame');

        socket.on('updateGame', (data) => {
            console.log('received updateGame', data);
            if (data.message) {
                this.$mdToast.show(this.$mdToast.simple()
                    // .position('top left')
                    .textContent(data.message)
                    .hideDelay(1500));
            }
            this.getGame();
        });

        socket.on('connect', () => this.joinGameRoom());
    }

    isStatus(status) {
        return this.game.status == status;
    }

    getTurn() {
        return this.game.currentRound % 3;
    }

    hasVoted(player = this.getPlayer()) {
        console.log('hasVoted', this.getRound().votes, player);
        return _.some(this.getRound().votes, {username: player});
    }

    hasGuessed(player = this.getPlayer()) {
        console.log('hasGuessed', this.getRound().votes, player);
        return _.some(this.getRound().votes, {username: player});
    }

    isTurn(player = this.getPlayer()) {
        return _.indexOf(this.game.players, player) == this.getTurn();
    }

    getPlayer() {
        return this.Settings.username;
    }

    getRound() {
        return this.game.rounds[this.game.currentRound];
    }

    getOtherPlayers(player = this.getPlayer()) {
        return _.without(this.game.players, player);
    }

    getCard() {
        return this.game.cards[this.game.currentRound];
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

    votesComplete() {
        return this.getRound().votes.length == this.game.players.length;
    }

    guessesComplete() {
        return this.getRound().guesses.length == this.game.players.length;
    }

    getMyVotes() {
        return _.filter(this.getRound().votes, {vote: this.getPlayer()});
    }

    getWinners() {
        let winners = _.chain(this.getRound().votes)
            .countBy('vote')
            .map((value, key) => ({username: key, votes: value}))
            .sortBy('votes')
            .value();

        winners = _.chain(winners)
            .filter({votes: _.maxBy(winners, 'votes')['votes']})
            .map('username')
            .value();

        return winners;
    };

    getPlayerCards(player = this.getPlayer()) {
        let cards = [];
        this.game.rounds.forEach((round, index) => {
            console.log('round', round, player, index)
            if (_.includes(round.winners, player)) {
                cards.push(this.game.cards[index]);
            }
        });

        console.log('getPlayerCards', cards);

        return cards;
    }

    getWinnersList() {
        return this.list(this.getWinners());
    };

    list(arr) {
        return arr.join(", ").replace(/, (?!.*, )/, " & ");
    }

    newRound() {
        socketReq('newRound', {
            username: this.getPlayer(),
            gameId: this.game._id,
            winners: this.getWinners(),
            currentRound: this.game.currentRound
        })
            .then((data) => {
                console.info('newRound', data);
                this.getGame();
            });
    }

    getLocalState() {
        let state = 'voting';

        if (this.votesComplete()) {
            state = 'guessing';
            state = 'finished';
        }

        return state;
    }

    isLocalState(state) {
        return state == this.getLocalState();
    }

    vote() {
        console.log('voteFor', this.voteFor);
        socketReq('vote',
            {
                username: this.getPlayer(),
                gameId: this.game._id,
                vote: this.voteFor,
                currentRound: this.game.currentRound
            })
            .then((data) => {
                console.info('vote', data);
                this.voteFor = undefined;
                this.getGame();

            });
    }

    sendChat() {
        console.log('sendChat', this.chatMessage);
        if (!this.chatMessage) return;
        socketReq('sendChat',
            {
                username: this.getPlayer(),
                gameId: this.game._id,
                chatMessage: this.chatMessage
            })
            .then((data) => {
                console.info('sendChat', data);
                this.chatMessage = undefined;
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



