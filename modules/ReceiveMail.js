'use strict';

module.exports = function(logger, Imap) {

    var MailParser = require('mailparser').MailParser,
        Q = require('q'),
        _ = require('underscore'),
        async = require('async'),
        config = require('../config'),
        defaultBox = 'INBOX';

    var setupImap = function(username, password) {
        return new Imap({
            user: username,
            password: password,
            host: config.imap.host,
            port: config.imap.port,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        });
    };

    var connectAndGetMailBoxes = function(imap, box, callback) {
        imap.once('ready', function() {
            logger.info('Connected to imap at %s', config.imap.host);
            async.parallel([
                getBoxes.bind(null, imap),
                openBox.bind(null, imap, box)
            ], function(err, result) {
                callback(null, {mailBoxes: result[0], selectedMailBoxContent: result[1]});
            });
        });

        imap.once('error', function(err) {
            callback(err);
        });

        imap.connect();
    };

    var connect = function(imap, box, callback) {
        imap.once('ready', function() {
            logger.info('Connected to imap at %s', config.imap.host);

            imap.openBox(box, true, function(err) {
                if (err) {
                    callback(err);
                    return;
                }

                callback();
            });
        });

        imap.once('error', function(err) {
            callback(err);
        });

        imap.connect();
    };

    var disconnect = function(imap, callback) {
        imap.once('end', function() {
            logger.info('Disconnected from %s', config.imap.host);
            callback();
        });

        imap.end();
    };

    var getBoxes = function(imap, callback) {
        imap.getBoxes(function(err, boxes) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, _.keys(boxes).reverse());
        });
    };

    var receiveBody = function(msg, callback) {
        msg.on('body', function(stream) {
            callback(null, stream);
        });
    };

    var receiveAttributes = function(msg, callback) {
        msg.on('attributes', function(attrs) {
            callback(null, attrs);
        });
    };

    var parseOneMessage = function(msg, callback) {
        var mailparser = new MailParser(),
            parsedMsgObj = {
                uid: msg.attrs.uid,
                flags: msg.attrs.flags,
                date: msg.attrs.date
            };

        mailparser.on('end', function(mail) {
            parsedMsgObj.subject = mail.subject;
            parsedMsgObj.from = mail.from[0];
            parsedMsgObj.to = mail.to[0];
            parsedMsgObj.text = mail.text;

            callback(null, parsedMsgObj);
        });

        msg.body.pipe(mailparser);
    };

    var parseMessages = function(msgs, callback) {
        async.map(msgs, parseOneMessage, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    };

    var fetchFromBox = function(imap, fetch, callback) {
        var msgs = [];

        fetch.on('message', function(msg, seqno) {
            var receivedMsg = {seqno: seqno};

            async.parallel([
                receiveBody.bind(null, msg),
                receiveAttributes.bind(null, msg)
            ], function(err, result) {
                receivedMsg.body = result[0];
                receivedMsg.attrs = result[1];
                msgs.push(receivedMsg);
            });
        });

        fetch.on('error', function(err) {
            callback(err);
        });

        fetch.once('end', function() {
            callback(null, msgs);
        });
    };

    var openBox = function(imap, mailbox, callback) {
        var fetch;

        imap.openBox(mailbox, true, function(err, openBox) {
            if (err) {
                callback(err);
                return;
            }

            logger.debug('Opened mail box: %s', mailbox);
            logger.debug('%s have %d total and %d new messages', mailbox, openBox.messages.total, openBox.messages.new);

            if (openBox.messages.total > 0) {
                fetch = imap.seq.fetch('1:*', {struct: true, bodies: ''});
                async.waterfall([
                    fetchFromBox.bind(null, imap, fetch),
                    parseMessages
                ], function(err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, {
                        totalMsgs: openBox.messages.total,
                        unreadMsgs: openBox.messages.new,
                        messages: result
                    });
                });
            } else {
                callback(null, {
                    totalMsgs: openBox.messages.total,
                    unreadMsgs: openBox.messages.new,
                    messages: []
                });
            }
        });
    };

    var searchBox = function(imap, uid, callback) {
        var fetch;

        imap.search(['ALL', ['UID', uid]], function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            fetch = imap.seq.fetch(result, {struct: true, bodies: ''});
            async.waterfall([
                fetchFromBox.bind(null, imap, fetch),
                parseMessages
            ], function(err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, result);
            });
        });
    };

    var getAllMessages = function(username, password, box) {
        var deferred = Q.defer(),
            imap = setupImap(username, password);

        async.series([
            connectAndGetMailBoxes.bind(null, imap, box || defaultBox),
            disconnect.bind(null, imap)
        ], function(err, result) {
            if (err) {
                deferred.reject(err.message);
            } else {
                deferred.resolve(result[0]);
            }
        });

        return deferred.promise;
    };

    var getOneMessage = function(username, password, uid, box) {
        var deferred = Q.defer(),
            imap = setupImap(username, password);

        async.series([
            connect.bind(null, imap, box || defaultBox),
            searchBox.bind(null, imap, uid),
            disconnect.bind(null, imap)
        ], function(err, result) {
            if (err) {
                deferred.reject(err.message);
            } else {
                deferred.resolve(result[1].shift());
            }
        });

        return deferred.promise;
    };

    return {
        getOneMessage: getOneMessage,
        getAllMessages: getAllMessages
    };
};