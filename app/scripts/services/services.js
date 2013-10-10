'use strict';

angular.module('svardMailApp')
    .factory('Headers', ['$resource', function ($resource) {
        // return $resource('/headers/start/:start/count/:count', {start: 1, count: 10});
        return $resource('../../mockmail.json');
    }])

    .factory('Mail', ['$resource', function ($resource) {
        // return $resource('/message/:uid');
        return $resource('../../mails/:uid.json', {});
    }])

    .factory('HeaderLoader', ['Headers', '$q', '$cacheFactory', function (Headers, $q, $cacheFactory) {
        return function (start, count) {
            var deferred = $q.defer(),
                mailCache;

            if ($cacheFactory.get('mailCache') === undefined) {
                Headers.get({start: start, count: count}, function (headers) {
                    mailCache = $cacheFactory('mailCache');
                    mailCache.put('mails', headers);
                    deferred.resolve(headers);
                }, function () {
                    deferred.reject('Unable to fetch headers');
                });
            } else {
                deferred.resolve($cacheFactory.get('mailCache').get('mails'));
            }

            return deferred.promise;
        };
    }])

    .factory('MailLoader', ['Mail', '$route', '$q', '$cacheFactory', function (Mail, $route, $q, $cacheFactory) {
        return function () {
            var deferred = $q.defer();

            if ($cacheFactory.get('mailCache') === undefined) {
                Mail.get({uid: $route.current.params.uid}, function (body) {
                    deferred.resolve(body);
                }, function () {
                    deferred.reject('Unable to fetch body, uid: ' + $route.current.params.uid);
                });
            } else {
                var mails = $cacheFactory.get('mailCache').get('mails'),
                    selectedMail;

                selectedMail = _.find(mails.headers, function(mail) {
                    return mail.uid === parseInt($route.current.params.uid, 10);
                });

                deferred.resolve(selectedMail);
            }

            return deferred.promise;
        };
    }])

    .factory('Mailer', ['$resource', function ($resource) {
        return $resource('/sendmail', {}, {send: {method: 'POST'}});
    }]);