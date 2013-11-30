'use strict';

module.exports = function(app, passport, Profiles, logger) {

    var Imap = require('imap'),
        ReceiveMail = require('../modules/ReceiveMail')(logger, Imap),
        SendMail = require('../modules/SendMail')(logger);

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
        ReceiveMail.getAllMessages(req.user.username, req.user.password, req.params.mailbox).then(function(messages) {
            resp.send(messages);
        }, function(err) {
            logger.error('Failed to fetch messages: %s', err.message);
            resp.send(500);
        });
    });

    app.get('/message/:mailbox/:uid', ensureAuthenticated, function(req, resp) {
        ReceiveMail.getOneMessage(req.user.username, req.user.password, req.params.uid, req.params.mailbox).then(function(message) {
            resp.send(message);
        }, function(err) {
            logger.error('Failed to fetch message %s: %s', req.params.uid, err.message);
            resp.send(500);
        });
    });

    app.delete('/message/:mailbox/:uid', ensureAuthenticated, function(req, resp) {
        ReceiveMail.deleteMessages(req.user.username, req.user.password, req.params.uid, req.params.mailbox);

        resp.send(200);
    });

    app.post('/search', ensureAuthenticated, function(req, resp) {
        ReceiveMail.searchMessages(req.user.username, req.user.password, req.body.query, req.body.mailbox).then(function (messages) {
            resp.send(messages);
        }, function() {
            resp.send(500);
        });
    });

    app.post('/sendmail', ensureAuthenticated, function(req, resp) {
        var reqParams = req.body,
            mail = SendMail.sendMail(req.user.username, req.user.password, reqParams.from, reqParams.to, reqParams.cc, reqParams.subject, reqParams.text);

        mail.then(function() {
            resp.send(200);
        }, function() {
            resp.send(500);
        });
    });

    app.get('/profile', ensureAuthenticated, function(req, resp) {
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

    app.post('/contact', ensureAuthenticated, function(req, resp) {
        var contact = Profiles.addContact(req.user._id, {
            email: req.body.email,
            name: req.body.name
        });

        contact.then(function (contactId) {
            resp.send(201, {_id: contactId});
        }, function () {
            resp.send(500);
        });
    });

    app.delete('/contact/:id', ensureAuthenticated, function(req, resp) {
        Profiles.deleteContact(req.user._id, req.params.id);

        resp.send(200);
    });

    app.put('/contact/:id', ensureAuthenticated, function(req, resp) {
        Profiles.updateContact(req.user._id, req.params.id, {
            email: req.body.email,
            name: req.body.name
        });

        resp.send(200);
    });
};