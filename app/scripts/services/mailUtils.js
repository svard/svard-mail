'use strict';

angular.module('svardMailApp')
    .factory('MailUtils', ['$filter', function ($filter) {
        var service = {
            initMail: function (mail, profile) {
                if (mail.from !== undefined) {
                    mail.from = this.formatAddress(mail.from.name, mail.from.address);
                    mail.to = this.formatAddress(profile.name, profile.username);
                    mail.cc = mail.cc || null;
                    return mail;
                } else {
                    return {
                        from: this.formatAddress(profile.name, profile.username),
                        to: null,
                        cc: null,
                        subject: null,
                        text: null
                    };
                }
            },

            formatAddress: function (name, address) {
                return name + ' <' + address + '>';
            },

            formatReplySubject: function (subject) {
                if (subject.substr(0, 3) === 'Re:') {
                    return subject;
                }

                return 'Re: '.concat(subject);
            },

            formatReplyText: function (mail) {
                var replyText = mail.text.split('\n')
                    .map(function (line) {
                        return '> ' + line;
                    });
                replyText.unshift($filter('date')(mail.date, 'yyyy/MM/dd') + ' ' + this.parseMailAddress(mail.from).name + ' wrote:');
                replyText.unshift('');

                return replyText.join('\n');
            },

            parseMailAddress: function (addressLine) {
                var regEx = /(\S+ \S+) <(\S+@\S+)>/,
                    match = addressLine.match(regEx);

                if (match) {
                    return {
                        name: match[1],
                        address: match[2]
                    };
                }

                return '';
            }
        };

        return service;
    }]);