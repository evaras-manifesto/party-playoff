'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = angular.module('app', ['ui.router', 'ngMaterial']);

app.run(function () {
    FastClick.attach(document.body);
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
    $stateProvider.state(new Route('home', "/", resolve)).state(new Route('settings', "/settings", resolve)).state(new Route('voting-home', "/voting-home", resolve)).state(new Route('voting-game', "/voting-game/:gameId", resolve));

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

app.service('Notifications', function () {
    _createClass(Notifications, [{
        key: 'show',
        value: function show(message) {
            var _this = this;

            this.visible = true;
            this.message = message;

            this.$timeout(function () {
                _this.visible = false;
            }, 2000);
        }
    }]);

    function Notifications($timeout) {
        _classCallCheck(this, Notifications);

        this.$timeout = $timeout;
        this.visible = false;
    }

    return Notifications;
}());

app.service('Settings', function () {
    _createClass(Settings, [{
        key: 'events',
        value: function events() {
            var _this2 = this;

            this.$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                console.log('toState', toState);

                if (toState.name != 'home' && toState.name != 'settings') {
                    if (_this2.username.length < 3) {
                        event.preventDefault();
                        _this2.$state.go('settings');
                    }
                }
                // event.preventDefault();
                // transitionTo() promise will be rejected with
                // a 'transition prevented' error
            });
        }
    }, {
        key: 'showHeader',
        value: function showHeader() {
            var name = this.$state.current.name;

            var show = true;

            if (name == 'home') {
                show = false;
            }

            if (this.username.length < 3) {
                show = false;
            }

            return show;
        }
    }, {
        key: 'back',
        value: function back() {
            var name = this.$state.current.name;

            if (name == 'voting-home') {
                this.$state.go('home');
            } else {
                this.$state.go('voting-home');
            }
        }
    }]);

    function Settings($state, $stateParams, $timeout, $mdToast, $rootScope) {
        _classCallCheck(this, Settings);

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

app.component('notificationComponent', {
    templateUrl: 'notification.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: function () {
        function notificationComponent(Notifications) {
            _classCallCheck(this, notificationComponent);

            this.Notifications = Notifications;
        }

        _createClass(notificationComponent, [{
            key: '$onInit',
            value: function $onInit() {
                console.log('notificationComponent', this);
            }
        }]);

        return notificationComponent;
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

                if (index < 0) index = 0;
                if (index > this.icons.length - 1) index = this.icons.length - 1;
                this.currentTab = index;
                this.$scope.$apply();
            }
        }, {
            key: 'moveTabs',
            value: function moveTabs() {
                return { transform: 'translateX(-' + this.currentTab + '00vw)' };
            }
        }]);

        function tabsComponent($rootScope, $element, $scope) {
            var _this3 = this;

            _classCallCheck(this, tabsComponent);

            this.$element = $element;
            this.$scope = $scope;
            this.currentTab = 0;
            $rootScope.$on('setTab', function (event, value) {
                return _this3.setTab(value);
            });
        }

        _createClass(tabsComponent, [{
            key: '$onInit',
            value: function $onInit() {
                var _this4 = this;

                console.log(this);

                var myElement = this.$element.get(0);

                // create a simple instance
                // by default, it only adds horizontal recognizers
                var mc = new Hammer(myElement);

                // listen to events...
                //             mc.on("swipe tap press", function (ev) {
                //                 console.log(ev.type + " gesture detected.");
                //             });

                mc.on("swipeleft", function (ev) {
                    console.log(ev.type + " gesture detected.");
                    _this4.setTab(_this4.currentTab + 1);
                });

                mc.on("swiperight", function (ev) {
                    console.log(ev.type + " gesture detected.");
                    _this4.setTab(_this4.currentTab - 1);
                });

                // var hammertime = new Hammer(this.$element, {});

                // $('body').hammer({}).bind('swipeleft', (ev) => {
                //     this.setTab(this.currentTab - 1);
                //     console.log(ev);
                // });
                // this.$element.hammer({}).bind('swiperight', (ev) => {
                //     this.setTab(this.currentTab + 1);
                //     console.log(ev);
                // });
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

app.controller('SettingsScreen', function () {
    _createClass(SettingsScreen, [{
        key: 'saveUsername',
        value: function saveUsername() {
            console.log('saveUsername', this.Settings.username);
            if (this.Settings.username) {
                localStorage.setItem('username', this.Settings.username);
            }
        }
    }]);

    function SettingsScreen(Settings) {
        _classCallCheck(this, SettingsScreen);

        this.Settings = Settings;
    }

    _createClass(SettingsScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);
        }
    }]);

    return SettingsScreen;
}());

app.controller('VotingGameScreen', function () {
    _createClass(VotingGameScreen, [{
        key: 'events',
        value: function events() {
            var _this5 = this;

            socket.removeListener('updateGame');

            socket.on('updateGame', function (data) {
                console.log('received updateGame', data);
                if (data.message) {
                    _this5.Notifications.show(data.message);
                }
                _this5.getGame();
            });

            socket.on('connect', function () {
                return _this5.joinGameRoom();
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
            var _this6 = this;

            socketReq('joinGameRoom', { username: this.getPlayer(), gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('joinGameRoom', data);
                _this6.update();
            });
        }
    }, {
        key: 'joinGame',
        value: function joinGame() {
            var _this7 = this;

            socketReq('joinGame', { username: this.getPlayer(), gameId: this.game._id }).then(function (data) {
                console.info('joinGame', data);
                _this7.getGame();
            });
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            var _this8 = this;

            socketReq('startGame', { username: this.getPlayer(), gameId: this.game._id }).then(function (data) {
                console.info('startGame', data);
                _this8.getGame();
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
            var _this9 = this;

            var player = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getPlayer();

            var cards = [];
            this.game.rounds.forEach(function (round, index) {
                console.log('round', round, player, index);
                if (_.includes(round.winners, player)) {
                    cards.push(_this9.game.cards[index]);
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
            var _this10 = this;

            socketReq('newRound', {
                username: this.getPlayer(),
                gameId: this.game._id,
                winners: this.getWinners(),
                currentRound: this.game.currentRound
            }).then(function (data) {
                console.info('newRound', data);
                _this10.getGame();
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
            var _this11 = this;

            console.log('voteFor', this.voteFor);
            socketReq('vote', {
                username: this.getPlayer(),
                gameId: this.game._id,
                vote: this.voteFor,
                currentRound: this.game.currentRound
            }).then(function (data) {
                console.info('vote', data);
                _this11.voteFor = undefined;
                _this11.getGame();
            });
        }
    }, {
        key: 'sendChat',
        value: function sendChat() {
            var _this12 = this;

            console.log('sendChat', this.chatMessage);
            if (!this.chatMessage) return;
            socketReq('sendChat', {
                username: this.getPlayer(),
                gameId: this.game._id,
                chatMessage: this.chatMessage
            }).then(function (data) {
                console.info('sendChat', data);
                _this12.chatMessage = undefined;
                _this12.getGame();
            });
        }
    }, {
        key: 'getGame',
        value: function getGame() {
            var _this13 = this;

            return socketReq('getGame', { username: this.Settings.username, gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('getGame', data);
                _this13.game = data;
                _this13.update();
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.$scope.$apply();
        }
    }]);

    function VotingGameScreen(Settings, $scope, $stateParams, $mdToast, Notifications) {
        _classCallCheck(this, VotingGameScreen);

        this.Settings = Settings;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.$mdToast = $mdToast;
        this.Notifications = Notifications;
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
            var _this14 = this;

            socketReq('addGame', { username: this.Settings.username }).then(function (data) {
                console.info('addGame', data);
                _this14.$state.go('voting-game', { gameId: data._id });
            });
        }
    }, {
        key: 'getGame',
        value: function getGame() {
            var _this15 = this;

            socketReq('getGame', { username: this.Settings.username, gameId: this.gameId }).then(function (data) {
                if (data) {
                    _this15.$state.go('voting-game', { gameId: _this15.gameId });
                } else {
                    _this15.Notifications.show('Game ' + _this15.gameId + ' does not exist.');
                }
                console.info('getGame', data);
                _this15.games = data;
                _this15.$scope.$apply();
            });
        }
    }, {
        key: 'getMyGames',
        value: function getMyGames() {
            var _this16 = this;

            socketReq('getMyGames', { username: this.Settings.username }).then(function (data) {
                console.info('getMyGames', data);
                _this16.games = data;
                _this16.$scope.$apply();
            });
        }
    }]);

    function VotingScreen(Settings, $scope, $state, Notifications) {
        _classCallCheck(this, VotingScreen);

        this.Settings = Settings;
        this.$scope = $scope;
        this.$state = $state;
        this.Notifications = Notifications;
        this.games = [];
        this.gameId = "";
    }

    _createClass(VotingScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);

            this.getMyGames();
        }
    }]);

    return VotingScreen;
}());