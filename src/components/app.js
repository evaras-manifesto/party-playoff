var app = angular.module('app', ['ui.router', 'ngMaterial']);

app.run(() => {
    // var socket = io();
});

app.directive('ngEnter', () => (scope, element, attrs) => {
    element.bind('keypress', (event) => {
        if (event.which !== 13) return;
        scope.$apply(() => scope.$eval(attrs.ngEnter, {$event: event}));
        event.preventDefault();
    });
});

var socket = io();

socket.on('connect', () => console.log('connected!'));
socket.on('disconnect', () => console.log('disconnected!'));

var socketReq = (name, data, callback) => {
    return new Promise(function (resolve, reject) {
        socket.emit(name, data, resolve);
    });
};