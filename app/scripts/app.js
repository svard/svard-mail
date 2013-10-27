'use strict';

angular.module('svardMailApp', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    mailbox: ['MailboxLoader', function (MailboxLoader) {
                        return new MailboxLoader('INBOX');
                    }]
                }
            })
            .when('/compose', {
                templateUrl: 'views/compose.html',
                controller: 'ComposeCtrl',
                resolve: {
                    mail: function () {
                        return undefined;
                    }
                }
            })
            .when('/compose/:uid', {
                templateUrl: 'views/compose_reply.html',
                controller: 'ComposeCtrl',
                resolve: {
                    mail: ['MailLoader', function (MailLoader) {
                        return new MailLoader('INBOX');
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
