'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = angular.module('app', ['ui.router', 'ngMaterial']);

app.run(function () {
    // var socket = io();
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keypress', function (event) {
            if (event.which !== 13) return;
            scope.$apply(function () {
                return scope.$eval(attrs.ngEnter, { $event: event });
            });
            event.preventDefault();
        });
    };
});

var socket = io();

socket.on('connect', function () {
    return console.log('connected!');
});
socket.on('disconnect', function () {
    return console.log('disconnected!');
});

var socketReq = function socketReq(name, data, callback) {
    return new Promise(function (resolve, reject) {
        socket.emit(name, data, resolve);
    });
};
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    //this controls the animations for each transition
    var resolve = {
        timeout: function timeout($timeout) {
            $('[screen]').removeClass('active');
            $timeout(function () {
                return $('[screen]').addClass('active');
            }, 350);
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider.state(new Route('home', "/", resolve)).state(new Route('voting-home', "/voting-home", resolve)).state(new Route('voting-game', "/voting-game/:gameId", resolve));

    //use real urls instead of hashes
    //$locationProvider.html5Mode(true);
});

var Route = function Route(name, url, resolve) {
    _classCallCheck(this, Route);

    _.extend(this, {
        name: name,
        url: url,
        templateUrl: _.kebabCase(name) + '-screen.html',
        controller: _.upperFirst(_.camelCase(name + 'Screen')),
        controllerAs: '$ctrl',
        resolve: resolve
    });
};

app.service('API', function ($state, $stateParams, $timeout, $http) {

    var API = "/";

    var getReq = function getReq(url, data) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';

        return $http[type](url, { params: data }).then(function (response) {
            console.log('req response', response);
            return response.data;
        }, function (err) {
            console.error(err);
            return $q.reject();
        });
    };

    var load = function load(url, data) {
        return getReq(API + url, data);
    };

    var loadNewsCard = function loadNewsCard(data) {
        return getReq(API + "public/json/news-card.json", data);
    };

    var init = function init() {};

    init();

    return {
        load: load,
        loadNewsCard: loadNewsCard
    };
});

app.service('Settings', function () {
    _createClass(Settings, [{
        key: 'back',
        value: function back() {
            console.log('$state.current.name', this.$state.current.name);
            var name = this.$state.current.name;

            if (name == 'voting-game') {
                this.$state.go('voting-home');
            } else {
                this.$state.go('home');
            }
        }
    }]);

    function Settings($state, $stateParams, $timeout, $http) {
        _classCallCheck(this, Settings);

        this.username;
        this.$state = $state;

        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
        }
    }

    return Settings;
}());

app.component('headerComponent', {
    templateUrl: 'header.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: function () {
        function headerComponent(Settings) {
            _classCallCheck(this, headerComponent);

            this.Settings = Settings;
        }

        _createClass(headerComponent, [{
            key: '$onInit',
            value: function $onInit() {
                console.log(this, 'header');
            }
        }]);

        return headerComponent;
    }()
});

app.component('tabsComponent', {
    templateUrl: 'tabs.html',
    controllerAs: '$ctrl',
    transclude: {
        tabs: '?tabs'
    },
    bindings: {
        icons: '='
    },
    controller: function () {
        _createClass(tabsComponent, [{
            key: 'isActive',
            value: function isActive(index) {
                return this.currentTab == index;
            }
        }, {
            key: 'setTab',
            value: function setTab(index) {
                console.log(index);
                return this.currentTab = index;
            }
        }, {
            key: 'moveTabs',
            value: function moveTabs() {
                return { transform: 'translateX(-' + this.currentTab + '00vw)' };
            }
        }]);

        function tabsComponent($rootScope) {
            var _this = this;

            _classCallCheck(this, tabsComponent);

            this.currentTab = 0;
            $rootScope.$on('setTab', function (event, value) {
                return _this.setTab(value);
            });
        }

        _createClass(tabsComponent, [{
            key: '$onInit',
            value: function $onInit() {
                console.log(this);
            }
        }]);

        return tabsComponent;
    }()
});
app.controller('HomeScreen', function () {
    _createClass(HomeScreen, [{
        key: 'saveUsername',
        value: function saveUsername() {
            console.log('saveUsername', this.Settings.username);
            if (this.Settings.username) {
                localStorage.setItem('username', this.Settings.username);
            }
        }
    }]);

    function HomeScreen(Settings) {
        _classCallCheck(this, HomeScreen);

        this.Settings = Settings;
    }

    _createClass(HomeScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);
        }
    }]);

    return HomeScreen;
}());

app.controller('VotingGameScreen', function () {
    _createClass(VotingGameScreen, [{
        key: 'events',
        value: function events() {
            var _this2 = this;

            socket.removeListener('updateGame');

            socket.on('updateGame', function (data) {
                console.log('received updateGame', data);
                if (data.message) {
                    _this2.$mdToast.show(_this2.$mdToast.simple().textContent(data.message).hideDelay(1500));
                }
                _this2.getGame();
            });

            socket.on('connect', function () {
                return _this2.joinGameRoom();
            });
        }
    }, {
        key: 'isStatus',
        value: function isStatus(status) {
            return this.game.status == status;
        }
    }, {
        key: 'getTurn',
        value: function getTurn() {
            return this.game.currentRound % 3;
        }
    }, {
        key: 'hasVoted',
        value: function hasVoted() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            console.log('hasVoted', this.getRound().votes, player);
            return _.some(this.getRound().votes, { username: player });
        }
    }, {
        key: 'hasGuessed',
        value: function hasGuessed() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            console.log('hasGuessed', this.getRound().votes, player);
            return _.some(this.getRound().votes, { username: player });
        }
    }, {
        key: 'isTurn',
        value: function isTurn() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            return _.indexOf(this.game.players, player) == this.getTurn();
        }
    }, {
        key: 'getPlayer',
        value: function getPlayer() {
            return this.Settings.username;
        }
    }, {
        key: 'getRound',
        value: function getRound() {
            return this.game.rounds[this.game.currentRound];
        }
    }, {
        key: 'getOtherPlayers',
        value: function getOtherPlayers() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            return _.without(this.game.players, player);
        }
    }, {
        key: 'getCard',
        value: function getCard() {
            return this.game.cards[this.game.currentRound];
        }
    }, {
        key: 'isHost',
        value: function isHost() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            return player == this.game.host;
        }
    }, {
        key: 'canStart',
        value: function canStart() {
            return this.isHost() && this.game.players.length > 2;
        }
    }, {
        key: 'hasJoined',
        value: function hasJoined() {
            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            return _.includes(this.game.players, player);
        }
    }, {
        key: 'joinGameRoom',
        value: function joinGameRoom() {
            var _this3 = this;

            socketReq('joinGameRoom', { username: this.getPlayer(), gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('joinGameRoom', data);
                _this3.update();
            });
        }
    }, {
        key: 'joinGame',
        value: function joinGame() {
            var _this4 = this;

            socketReq('joinGame', { username: this.getPlayer(), gameId: this.game._id }).then(function (data) {
                console.info('joinGame', data);
                _this4.getGame();
            });
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            var _this5 = this;

            socketReq('startGame', { username: this.getPlayer(), gameId: this.game._id }).then(function (data) {
                console.info('startGame', data);
                _this5.getGame();
            });
        }
    }, {
        key: 'votesComplete',
        value: function votesComplete() {
            return this.getRound().votes.length == this.game.players.length;
        }
    }, {
        key: 'guessesComplete',
        value: function guessesComplete() {
            return this.getRound().guesses.length == this.game.players.length;
        }
    }, {
        key: 'getMyVotes',
        value: function getMyVotes() {
            return _.filter(this.getRound().votes, { vote: this.getPlayer() });
        }
    }, {
        key: 'getWinners',
        value: function getWinners() {
            var winners = _.chain(this.getRound().votes).countBy('vote').map(function (value, key) {
                return { username: key, votes: value };
            }).sortBy('votes').value();

            winners = _.chain(winners).filter({ votes: _.maxBy(winners, 'votes')['votes'] }).map('username').value();

            return winners;
        }
    }, {
        key: 'getPlayerCards',
        value: function getPlayerCards() {
            var _this6 = this;

            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            var cards = [];
            this.game.rounds.forEach(function (round, index) {
                console.log('round', round, player, index);
                if (_.includes(round.winners, player)) {
                    cards.push(_this6.game.cards[index]);
                }
            });

            console.log('getPlayerCards', cards);

            return cards;
        }
    }, {
        key: 'getWinnersList',
        value: function getWinnersList() {
            return this.list(this.getWinners());
        }
    }, {
        key: 'list',
        value: function list(arr) {
            return arr.join(", ").replace(/, (?!.*, )/, " & ");
        }
    }, {
        key: 'newRound',
        value: function newRound() {
            var _this7 = this;

            socketReq('newRound', {
                username: this.getPlayer(),
                gameId: this.game._id,
                winners: this.getWinners(),
                currentRound: this.game.currentRound
            }).then(function (data) {
                console.info('newRound', data);
                _this7.getGame();
            });
        }
    }, {
        key: 'getLocalState',
        value: function getLocalState() {
            var state = 'voting';

            if (this.votesComplete()) {
                state = 'guessing';
                state = 'finished';
            }

            return state;
        }
    }, {
        key: 'isLocalState',
        value: function isLocalState(state) {
            return state == this.getLocalState();
        }
    }, {
        key: 'vote',
        value: function vote() {
            var _this8 = this;

            console.log('voteFor', this.voteFor);
            socketReq('vote', {
                username: this.getPlayer(),
                gameId: this.game._id,
                vote: this.voteFor,
                currentRound: this.game.currentRound
            }).then(function (data) {
                console.info('vote', data);
                _this8.voteFor = undefined;
                _this8.getGame();
            });
        }
    }, {
        key: 'sendChat',
        value: function sendChat() {
            var _this9 = this;

            console.log('sendChat', this.chatMessage);
            socketReq('sendChat', {
                username: this.getPlayer(),
                gameId: this.game._id,
                chatMessage: this.chatMessage
            }).then(function (data) {
                console.info('sendChat', data);
                _this9.chatMessage = undefined;
                _this9.getGame();
            });
        }
    }, {
        key: 'getGame',
        value: function getGame() {
            var _this10 = this;

            return socketReq('getGame', { username: this.Settings.username, gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('getGame', data);
                _this10.game = data;
                _this10.update();
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.$scope.$apply();
        }
    }]);

    function VotingGameScreen(Settings, $scope, $stateParams, $mdToast) {
        _classCallCheck(this, VotingGameScreen);

        this.Settings = Settings;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.$mdToast = $mdToast;
        this.game = {};
    }

    _createClass(VotingGameScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);

            this.events();
            this.getGame();
            this.joinGameRoom();
        }
    }]);

    return VotingGameScreen;
}());

app.controller('VotingHomeScreen', function () {
    _createClass(VotingScreen, [{
        key: 'addGame',
        value: function addGame() {
            var _this11 = this;

            socketReq('addGame', { username: this.Settings.username }).then(function (data) {
                console.info('addGame', data);
                _this11.$state.go('voting-game', { gameId: data._id });
            });
        }
    }, {
        key: 'getAllGames',
        value: function getAllGames() {
            var _this12 = this;

            socketReq('getAllGames', { username: this.Settings.username }).then(function (data) {
                console.info('getAllGames', data);
                _this12.games = data;
                _this12.$scope.$apply();
            });
        }
    }]);

    function VotingScreen(Settings, $scope, $state) {
        _classCallCheck(this, VotingScreen);

        this.Settings = Settings;
        this.$scope = $scope;
        this.$state = $state;
        this.games = [];
    }

    _createClass(VotingScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);

            this.getAllGames();
        }
    }]);

    return VotingScreen;
}());