var bookstore = angular.module('bookstore', [
                                'ui.router',
                                'bookstore.factories',
                                'bookstore.controllers',
                                'bookstore.constants'
                                ])


.run(['$rootScope', '$state', 'authProvider',
    function ($rootScope, $state, authProvider, $localStorage) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            var publicStates = ['login'];
            var isPublicStates = publicStates.indexOf(toState.name) > -1;
            console.log('isPublicStates ='+isPublicStates)
            console.log('isLoggedIn = '+authProvider.isLoggedIn())

            // Redirect logged out user from list of restricted pages
            if (!isPublicStates && !authProvider.isLoggedIn()) {
              event.preventDefault();
              return $state.go('login');
            }
            // Avoid logged in user nevigate to login page
            if (toState.name == 'login' && authProvider.isLoggedIn()) { 
              return event.preventDefault();
            }
        });
}])


.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
    })
    .state('restrictedPage', {
        url: '/restrictedPage',
        templateUrl: 'views/restrictedPage.html',
        controller: 'restrictedPageCtrl'
    })

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('login')
})
