'use strict';

angular.module('svardMailApp')
    .factory('Mailbox', ['$resource', function ($resource) {
        return $resource('/message/:mailbox');
        // return $resource('../../mockmail.json');
    }])

    .factory('Mail', ['$resource', function ($resource) {
        return $resource('/message/:mailbox/:uid');
        // return $resource('../../mails/:uid.json', {});
    }])

    .factory('Profile', ['$resource', function ($resource) {
        return $resource('/profile');
    }])

    .factory('Contact', ['$resource', function ($resource) {
        return $resource('/contact/:id', {}, {
            update: {method: 'PUT'}
        });
    }])

    .factory('MailboxLoader', ['Mailbox', '$q', '$cacheFactory', function (Mailbox, $q, $cacheFactory) {
        return function (mailbox) {
            var deferred = $q.defer(),
                mailCache;

            if ($cacheFactory.get(mailbox) === undefined) {
                Mailbox.get({mailbox: mailbox}, function (mails) {
                    mailCache = $cacheFactory(mailbox);
                    mailCache.put('mails', mails);
                    deferred.resolve(mails);
                }, function () {
                    deferred.reject('Unable to fetch headers');
                });
            } else {
                deferred.resolve($cacheFactory.get(mailbox).get('mails'));
            }

            return deferred.promise;
        };
    }])

    .factory('MailLoader', ['Mail', '$route', '$q', '$cacheFactory', function (Mail, $route, $q, $cacheFactory) {
        return function (mailbox) {
            var deferred = $q.defer();

            if ($cacheFactory.get(mailbox) === undefined) {
                Mail.get({mailbox: mailbox, uid: $route.current.params.uid}, function (mail) {
                    deferred.resolve(mail);
                }, function () {
                    deferred.reject('Unable to fetch mail, uid: ' + $route.current.params.uid);
                });
            } else {
                var mails = $cacheFactory.get(mailbox).get('mails'),
                    selectedMail;

                selectedMail = _.find(mails.selectedMailBoxContent.messages, function(mail) {
                    return mail.uid === parseInt($route.current.params.uid, 10);
                });

                deferred.resolve(selectedMail);
            }

            return deferred.promise;
        };
    }])

    .factory('Mailer', ['$resource', function ($resource) {
        return $resource('/sendmail', {}, {send: {method: 'POST'}});
    }])

    .factory('ProfileLoader', ['Profile', '$q', function (Profile, $q) {
        return function () {
            var deferred = $q.defer();

            Profile.get(function (profile) {
                deferred.resolve(profile);
            }, function (err) {
                deferred.reject('Unable to fetch profile: %s', err.message);
            });

            return deferred.promise;
        };
    }]);