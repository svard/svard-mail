'use strict';

angular.module('svardMailApp', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    headers: ['HeaderLoader', function (HeaderLoader) {
                        return new HeaderLoader(1, 20);
                    }]
                }
            })
            .when('/compose', {
                templateUrl: 'views/compose.html',
                controller: 'ComposeCtrl'
            })
            .when('/compose/:uid', {
                templateUrl: 'views/compose_reply.html',
                controller: 'ComposeReplyCtrl',
                resolve: {
                    body: ['BodyLoader', function (BodyLoader) {
                        return new BodyLoader();
                    }]
                }
            })
            .when('/contacts', {
                templateUrl: 'views/contacts.html',
                controller: 'ContactsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
