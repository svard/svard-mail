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

    .factory('BodyLoader', ['MailBody', '$route', '$q', '$cacheFactory', function (MailBody, $route, $q, $cacheFactory) {
        return function () {
            var deferred = $q.defer(),
                mailCache;

            if ($cacheFactory.get('mailCache') === undefined) {
                MailBody.get({uid: $route.current.params.uid}, function (body) {
                    deferred.resolve(body);
                }, function () {
                    deferred.reject('Unable to fetch body, uid: ' + $route.current.params.uid);
                });
            } else {
                var mails = $cacheFactory.get('mailCache').get('mails'),
                    selectedMail;

                selectedMail = _.find(mails.headers, function(mail) {
                    return mail.uid == $route.current.params.uid;
                });

                deferred.resolve(selectedMail);
            }

            return deferred.promise;
        };
    }])

    .factory('Mailer', ['$resource', function ($resource) {
        return $resource('/sendmail', {}, {send: {method: 'POST'}});
    }]);