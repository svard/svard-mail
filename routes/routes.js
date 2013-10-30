'use strict';

module.exports = function(app, passport, Profiles, logger) {

    var Imap = require('imap'),
        ReceiveMail = require('../modules/ReceiveMail')(logger, Imap),
        SendMail = require('../modules/SendMail')(logger);
        // config = require('../config');

    var ensureAuthenticated = function (req, resp, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        resp.send(401);
    };

    var ensureAuthenticatedOrRedirect = function (req, resp, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        resp.redirect('/login');
    };

    app.get('/', ensureAuthenticatedOrRedirect, function(req, resp) {
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

    app.get('/message/:mailbox', ensureAuthenticated, function(req, resp) {
        // ReceiveMail.getAllMessages(req.user.username, req.user.password, req.params.mailbox).then(function(messages) {
        ReceiveMail.getAllMessages(config.imap.user, config.imap.password, req.params.mailbox).then(function(messages) {
            resp.send(messages);
        }, function(err) {
            logger.error('Failed to fetch messages: %s', err.message);
            resp.send(500);
        });
    });

    app.get('/message/:mailbox/:uid', ensureAuthenticated, function(req, resp) {
        // ReceiveMail.getOneMessage(req.user.username, req.user.password, req.params.uid, req.params.mailbox).then(function(message) {
        ReceiveMail.getOneMessage(config.imap.user, config.imap.password, req.params.uid, req.params.mailbox).then(function(message) {
            resp.send(message);
        }, function(err) {
            logger.error('Failed to fetch message %s: %s', req.params.uid, err.message);
            resp.send(500);
        });
    });

    app.post('/sendmail', ensureAuthenticated, function(req, resp) {
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
        // var profile = Profiles.findById(req.user._id);
        var profile = Profiles.findById('525046a5b31cf7aa76000002');

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

    app.post('/contact', function(req, resp) {
        // var contact = Profiles.addContact(req.user._id, {
        //     email: req.body.email,
        //     name: req.body.name
        // });
        var contact = Profiles.addContact('525046a5b31cf7aa76000002', {
            email: req.body.email, 
            name: req.body.name
        });

        contact.then(function (contactId) {
            resp.send(201, {_id: contactId});
        }, function () {
            resp.send(500);
        });
    });

    app.delete('/contact/:id', function(req, resp) {
        // Profiles.deleteContact(req.user._id, req.params.id);
        Profiles.deleteContact('525046a5b31cf7aa76000002', req.params.id);
        resp.send(200);
    });

    app.put('/contact/:id', function(req, resp) {
        // Profiles.updateContact(req.user._id, req.params.id, {
        //     email: req.body.email, 
        //     name: req.body.name
        // });
        Profiles.updateContact('525046a5b31cf7aa76000002', req.params.id, {
            email: req.body.email, 
            name: req.body.name
        });
        resp.send(200);
    });
};