'use strict';

module.exports = function(app, passport, Profiles, logger) {

    var Imap = require('imap'),
        _ = require('underscore'),
        Mail = require('../modules/Mail')(logger, Imap),
        SendMail = require('../modules/SendMail')(logger),
        utils = require('../modules/utils'),
        config = require('../config');

    var ensureAuthenticated = function (req, resp, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        resp.redirect('/login');
    };

    app.get('/', ensureAuthenticated, function(req, resp) {
        resp.render('index.html');
    });

    app.get('/login', function(req, resp) {
        resp.render('login.html', {error: req.flash('error'), info: req.flash('info')});
    });

    app.post('/login', passport.authenticate('local', {successRedirect: '/',
                                                       failureRedirect: '/login',
                                                       failureFlash: true})
    );

    app.get('/logout', function(req, resp) {
        req.logout();
        req.flash('info', 'Logged out');
        resp.redirect('/login');
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

    app.post('/sendmail', function(req, resp) {
        var reqParams = req.body,
            // mail = SendMail.sendMail(req.user.username, req.user.password, reqParams.from, reqParams.to, reqParams.cc, reqParams.subject, reqParams.text);
            mail = SendMail.sendMail(config.imap.user, config.imap.password, reqParams.from, reqParams.to, reqParams.cc, reqParams.subject, reqParams.text);

        mail.then(function() {
            resp.send(200);
        }, function() {
            resp.send(500);
        });
    });

    app.get('/profile', function(req, resp) {
        var profile = Profiles.findById(req.user._id);

        profile.then(function(doc) {
            if (doc !== null) {
                resp.send(doc);
            } else {
                resp.send(404);
            }
        }, function() {
            resp.send(500);
        });
    });
};