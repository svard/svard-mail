'use strict';

angular.module('svardMailApp')
    .factory('Headers', ['$resource', function ($resource) {
        // return $resource('/headers/start/:start/count/:count', {start: 1, count: 10});
        return $resource('../../mockmail.json');
    }])

    .factory('MailBody', ['$resource', function ($resource) {
        // return $resource('/message/:uid');
        return $resource('../../mails/:uid.json', {});
    }])

    .factory('HeaderLoader', ['Headers', '$q', function (Headers, $q) {
        return function (start, count) {
            var deferred = $q.defer();
            Headers.get({start: start, count: count}, function (headers) {
                deferred.resolve(headers);
            }, function () {
                deferred.reject('Unable to fetch headers');
            });

            return deferred.promise;
        };
    }])

    .factory('BodyLoader', ['MailBody', '$route', '$q', function (MailBody, $route, $q) {
        return function () {
            var deferred = $q.defer();
            MailBody.get({uid: $route.current.params.uid}, function (body) {
                deferred.resolve(body);
            }, function () {
                deferred.reject('Unable to fetch body, uid: ' + $route.current.params.uid);
            });

            return deferred.promise;
        };
    }]);