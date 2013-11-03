'use strict';

angular.module('svardMailApp', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/mailbox/:mailbox', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    mailbox: ['MailboxLoader', '$route', function (MailboxLoader, $route) {
                        return new MailboxLoader($route.current.params.mailbox);
                    }]
                }
            })
            .when('/compose', {
                templateUrl: 'views/compose.html',
                controller: 'ComposeCtrl'
            })
            .when('/compose/:uid', {
                templateUrl: 'views/compose_reply.html',
                controller: 'ComposeCtrl'
            })
            .when('/contacts', {
                templateUrl: 'views/contacts.html',
                controller: 'ContactsCtrl'
            })
            .otherwise({
                redirectTo: '/mailbox/INBOX'
            });
    });
