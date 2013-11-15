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

            imap.openBox(box, false, function(err) {
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

    var disconnect = function(imap, result, callback) {
        imap.once('end', function() {
            logger.info('Disconnected from %s', config.imap.host);
            callback(null, result);
        });

        imap.closeBox(function (err) {
            if (err) {
                callback(err);
                return;
            }
            imap.end();
        });
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

    var fetch = function(imap, uid, callback) {
        var msgs = [],
            fetch = imap.fetch(uid, {struct: true, bodies: ''});

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
        imap.openBox(mailbox, true, function(err, openBox) {
            if (err) {
                callback(err);
                return;
            }

            logger.debug('Opened mail box: %s', mailbox);
            logger.debug('%s have %d total and %d new messages', mailbox, openBox.messages.total, openBox.messages.new);

            if (openBox.messages.total > 0) {
                async.waterfall([
                    fetch.bind(null, imap, '1:*'),
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

    // var searchBox = function(imap, uid, callback) {
    //     var searchCriteria = ['UID'].concat(uid);

    //     imap.search(['ALL', searchCriteria], function(err, result) {
    //         if (err) {
    //             callback(err);
    //             return;
    //         }
    //         callback(null, result);
    //     });
    // };

    var addFlag = function(imap, uid, flag, callback) {
        imap.addFlags(uid, flag, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, null);
        });
    };

    var moveMessages = function(imap, uid, box, callback) {
        imap.move(uid, box, function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, null);
        });
    };

    var getAllMessages = function(username, password, box) {
        var deferred = Q.defer(),
            imap = setupImap(username, password);

        async.waterfall([
            connectAndGetMailBoxes.bind(null, imap, box || defaultBox),
            disconnect.bind(null, imap)
        ], function(err, result) {
            if (err) {
                deferred.reject(err.message);
            } else {
                deferred.resolve(result);
            }
        });

        return deferred.promise;
    };

    var getOneMessage = function(username, password, uid, box) {
        var deferred = Q.defer(),
            imap = setupImap(username, password);

        async.waterfall([
            connect.bind(null, imap, box || defaultBox),
            fetch.bind(null, imap, uid),
            parseMessages,
            disconnect.bind(null, imap)
        ], function(err, result) {
            if (err) {
                deferred.reject(err.message);
            } else {
                deferred.resolve(result.shift());
            }
        });

        return deferred.promise;
    };

    var deleteMessages = function(username, password, uid, box) {
        var imap = setupImap(username, password);

        if (box === 'Trash') {
            async.waterfall([
                connect.bind(null, imap, box || defaultBox),
                addFlag.bind(null, imap, uid, 'Deleted'),
                disconnect.bind(null, imap)
            ], function(err) {
                if (err) {
                    logger.error('Failed to delete message: %s', err.message);
                }
            });
        } else {
            async.waterfall([
                connect.bind(null, imap, box || defaultBox),
                moveMessages.bind(null, imap, uid, 'Trash'),
                disconnect.bind(null, imap)
            ], function(err) {
                if (err) {
                    logger.error('Failed to delete message: %s', err.message);
                }
            });
        }
    };

    return {
        getOneMessage: getOneMessage,
        getAllMessages: getAllMessages,
        deleteMessages: deleteMessages
    };
};