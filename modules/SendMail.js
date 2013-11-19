'use strict';

module.exports = function(logger) {

    var nodemailer = require('nodemailer'),
        Q = require('q'),
        config = require('../config');

    var setupTransport = function (username, password) {
        return nodemailer.createTransport('SMTP', {
            host: config.smtp.host,
            secureConnection: false,
            port: config.smtp.port,
            auth: {
                user: username,
                pass: password
            },
            ignoreTLS: false
        });
    };

    var sendMail = function (username, password, from, to, cc, subject, text) {
        var deferred = Q.defer(),
            transport = setupTransport(username, password);

        transport.sendMail({
            from: from,
            to: to,
            cc: cc,
            bcc: from,
            subject: subject,
            text: text
        }, function (error, response) {
            if (!error) {
                logger.debug('Mail sent: %s', response.message);
                deferred.resolve(response);
            } else {
                logger.error('Failed to send mail: %s', error.code);
                deferred.reject(error);
            }

            transport.close();
        });

        return deferred.promise;
    };

    return {
        sendMail: sendMail
    };
};