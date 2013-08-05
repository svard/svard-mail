module.exports = function(app, logger) {
    'use strict';

    var Imap = require('imap'),
        _ = require('underscore'),
        Mail = require('../modules/Mail')(logger, Imap),
        utils = require('../modules/utils');

    app.get('/', function(req, resp) {
        resp.render('index.html');
    });

    app.get('/headers/start/:from/count/:count', function(req, resp) {
        var from = parseInt(req.params.from, 10),
            count = parseInt(req.params.count, 10),
            preCond = utils.condition(utils.validator('can not be zero', utils.complement(utils.zero)),
                                      utils.validator('can not be negative', utils.complement(utils.negative))),
            checkedGetHeaders = _.partial(preCond, Mail.getHeaders);

        try {
            checkedGetHeaders(from, count).then(function(headers) {
                resp.send(headers);
            }, function(err) {
                logger.error('Can\'t fetch headers: %s, from: %d, count: %d:', err.message, from, count);
                resp.send(500);
            });
        } catch(e) {
            logger.error(e.message);
            resp.send(500);
        }
    });

    app.get('/message/:uid', function(req, resp) {
        var uid = parseInt(req.params.uid, 10),
            preCond = utils.condition(utils.validator('can not be zero', utils.complement(utils.zero)),
                                      utils.validator('can not be negative', utils.complement(utils.negative))),
            checkedGetOneMessage = _.partial(preCond, Mail.getOneMessage);

        try {
            checkedGetOneMessage(uid).then(function(message) {
                resp.send(message);
            }, function(err) {
                logger.error('Can\'t fetch message body: %s, uid: %d', err.message, uid);
                resp.send(500);
            });
        } catch(e) {
            logger.error(e.message);
            resp.send(500);
        }
    });
};