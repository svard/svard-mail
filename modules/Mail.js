module.exports = function(logger, Imap) {
    'use strict';

    var MailParser = require('mailparser').MailParser,
        Q = require('q'),
        config = require('../config.json'),

        imap = new Imap({
            user: config.imap.user,
            password: config.imap.password,
            host: config.imap.host,
            port: config.imap.port,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });

    var getHeaders = function(start, count) {
        var responseObj = {},
            headers = [],
            deferred = Q.defer();

        imap.once('ready', function() {
            logger.info('Connected to imap at %s', config.imap.host);

            imap.openBox('INBOX', true, function(err, box) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                var total = box.messages.total,
                    from = total - start + 1,
                    to = from - count + 1;

                if (count > total) {
                    to = '1';
                    count = total - start + 1;
                }
                if (start > total || start <= 0) {
                    deferred.reject(new Error('Start point out of bounds'));
                    imap.end();
                    return;
                }

                logger.info('You have %s total messages and %s new messages', total, box.messages.new);
                responseObj.totalMsg = total;
                responseObj.unreadMsg = box.messages.new;

                var fetch = imap.seq.fetch(from + ':' + to, {struct: true, bodies: 'HEADER'});
                fetch.on('message', function(msg, seqno) {
                    var mailparser = new MailParser(),
                        mailObj = {};

                    mailObj.seqno = seqno;

                    msg.on('body', function(stream) {
                        mailparser.on('end', function(mail) {
                            mailObj.subject = mail.subject;
                            mailObj.from = mail.from;
                            headers.push(mailObj);
                            if (headers.length === count) {
                                responseObj.headers = headers;
                                deferred.resolve(responseObj);
                            }
                        });

                        stream.pipe(mailparser);
                    });

                    msg.on('attributes', function(attrs) {
                        mailObj.uid = attrs.uid;
                        mailObj.flags = attrs.flags;
                        mailObj.date = attrs.date;
                    });
                });

                fetch.once('end', function() {
                    imap.end();
                });
            });
        });

        imap.once('end', function() {
            logger.info('Disconnected from %s', config.imap.host);
        });

        imap.connect();

        return deferred.promise;
    };

    var getOneMessage = function(uid) {
        var mailObj = {},
            deferred = Q.defer();

        imap.once('ready', function() {
            logger.info('Connected to imap at %s', config.imap.host);

            imap.openBox('INBOX', true, function(err) {
                if (err) {
                    deferred.reject(err);
                    return;
                }

                imap.search(['ALL', ['UID', uid]], function(err, result) {
                    if (err) {
                        deferred.reject(err);
                        return;
                    }

                    var fetch = imap.seq.fetch(result, {struct: true, bodies: ''});
                    fetch.on('message', function(msg, seqno) {
                        var mailparser = new MailParser();

                        mailObj.seqno = seqno;

                        msg.on('body', function(stream) {
                            mailparser.on('end', function(mail) {
                                mailObj.subject = mail.subject;
                                mailObj.from = mail.from;
                                mailObj.text = mail.text;
                                mailObj.html = mail.html;
                                // mailObj.attachments = mail.attachments;

                                deferred.resolve(mailObj);
                            });

                            stream.pipe(mailparser);
                        });

                        msg.on('attributes', function(attrs) {
                            mailObj.uid = attrs.uid;
                            mailObj.flags = attrs.flags;
                            mailObj.date = attrs.date;
                        });
                    });

                    fetch.once('end', function() {
                        imap.end();
                    });
                });
            });
        });

        imap.once('end', function() {
            logger.info('Disconnected from %s', config.imap.host);
        });

        imap.connect();

        return deferred.promise;
    };

    return {
        getHeaders: getHeaders,
        getOneMessage: getOneMessage
    };
};