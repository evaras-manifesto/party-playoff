app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {

    //this controls the animations for each transition
    var resolve = {
        timeout: ($timeout) => {
            $('[screen]').removeClass('active');
            $timeout(() => $('[screen]').addClass('active'), 350);
            return $timeout(300);
        }
    };

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state(new Route('home', "/", resolve))
        .state(new Route('voting-home', "/voting-home", resolve))
        .state(new Route('voting-game', "/voting-game/:gameId", resolve))

    //use real urls instead of hashes
    //$locationProvider.html5Mode(true);
});

class Route {
    constructor(name, url, resolve) {
        _.extend(this, {
            name,
            url,
            templateUrl: `${_.kebabCase(name)}-screen.html`,
            controller: _.upperFirst(_.camelCase(`${name}Screen`)),
            controllerAs: '$ctrl',
            resolve
        });
    }
}