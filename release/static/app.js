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
    $stateProvider.state(new Route('home', "/", resolve)).state(new Route('voting', "/voting", resolve));

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

        this.username = '';
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
app.component('votingHomeComponent', {
    templateUrl: 'voting-home.html',
    controllerAs: '$ctrl',
    transclude: {},
    bindings: {},
    controller: function () {
        _createClass(votingHomeComponent, [{
            key: 'events',
            value: function events() {
                var _this2 = this;

                socket.on('allGamesList', function (data) {
                    console.info('allGamesList', data);
                    _this2.games = data;
                    _this2.$scope.$apply();
                    // console.info('apply', data[0]);
                });
            }
        }]);

        function votingHomeComponent(Settings, $scope, $mdDialog) {
            _classCallCheck(this, votingHomeComponent);

            this.Settings = Settings;
            this.$scope = $scope;
            this.games = [];
        }

        _createClass(votingHomeComponent, [{
            key: '$onInit',
            value: function $onInit() {
                console.log(this);
                this.events();

                socket.emit('getAllGames', { username: this.Settings.username });
            }
        }]);

        return votingHomeComponent;
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

app.controller('VotingScreen', function () {
    function VotingScreen() {
        _classCallCheck(this, VotingScreen);
    }

    _createClass(VotingScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);
        }
    }]);

    return VotingScreen;
}());

app.controller('VotingGameScreen', function () {
    function VotingGameScreen() {
        _classCallCheck(this, VotingGameScreen);
    }

    _createClass(VotingGameScreen, [{
        key: '$onInit',
        value: function $onInit() {
            console.log(this);
        }
    }]);

    return VotingGameScreen;
}());