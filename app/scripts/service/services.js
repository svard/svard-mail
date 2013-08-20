'use strict';

angular.module('svardMailApp')
    .factory('Headers', ['$resource', function($resource) {
        // return $resource('/headers/start/:start/count/:count', {start: 1, count: 10});
        return $resource('../../mockmail.json', {start: 1, count: 10});
    }])

    .factory('HeaderLoader', ['Headers', '$q', function(Headers, $q) {
        return function(start, count) {
            var deferred = $q.defer();
            Headers.get({start: start, count: count}, function(headers) {
                deferred.resolve(headers);
            }, function() {
                deferred.reject('Unable to fetch headers');
            });

            return deferred.promise;
        };
    }]);
