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
    function Settings($state, $stateParams, $timeout, $http) {
        _classCallCheck(this, Settings);

        this.username = 'Nazzanuk';
    }

    _createClass(Settings, [{
        key: '$onInit',
        value: function $onInit() {}
    }]);

    return Settings;
}());

app.component('headerComponent', {
    templateUrl: 'header.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: function () {
        function headerComponent() {
            _classCallCheck(this, headerComponent);
        }

        _createClass(headerComponent, [{
            key: '$onInit',
            value: function $onInit() {
                console.log('header');
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

app.controller('VotingHomeScreen', function () {
    _createClass(VotingScreen, [{
        key: 'addGame',
        value: function addGame() {
            var _this2 = this;

            socketReq('addGame', { username: this.Settings.username }).then(function (data) {
                console.info('addGame', data);
                _this2.$state.go('voting-game', { gameId: data._id });
            });
        }
    }, {
        key: 'getAllGames',
        value: function getAllGames() {
            var _this3 = this;

            socketReq('getAllGames', { username: this.Settings.username }).then(function (data) {
                console.info('getAllGames', data);
                _this3.games = data;
                _this3.$scope.$apply();
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

app.controller('VotingGameScreen', function () {
    _createClass(VotingGameScreen, [{
        key: 'events',
        value: function events() {}
    }, {
        key: 'getPlayer',
        value: function getPlayer() {
            return this.Settings.username;
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
        key: 'joinGame',
        value: function joinGame() {
            var _this4 = this;

            socketReq('joinGame', { username: this.Settings.username, gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('joinGame', data);
                _this4.update();
            });
        }
    }, {
        key: 'getGame',
        value: function getGame() {
            var _this5 = this;

            socketReq('getGame', { username: this.Settings.username, gameId: this.$stateParams.gameId }).then(function (data) {
                console.info('getGame', data);
                _this5.game = data;
                _this5.update();
            });
        }
    }, {
        key: 'update',
        value: function update() {
            this.$scope.$apply();
        }
    }]);

    function VotingGameScreen(Settings, $scope, $stateParams) {
        _classCallCheck(this, VotingGameScreen);

        this.Settings = Settings;
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.game = {};
    }

    _createClass(VotingGameScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);

            this.events();
            this.getGame();
        }
    }]);

    return VotingGameScreen;
}());