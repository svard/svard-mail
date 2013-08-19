'use strict';

angular.module('svardMailApp', ['ngResource'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    // headers: function(HeaderLoader) {
                    //     return new HeaderLoader(1, 3);
                    // }
                }
            })
            .when('/compose', {
                templateUrl: 'views/compose.html',
                controller: 'ComposeCtrl'
            })
            .when('/contacts', {
                templateUrl: 'views/contacts.html',
                controller: 'ContactsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
