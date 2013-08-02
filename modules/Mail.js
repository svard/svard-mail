module.exports = function(logger) {
	var Imap = require('imap'),
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
    	imap.once('ready', function() {
    		logger.info('Connected to imap at %s', config.imap.host);

    		imap.openBox('INBOX', true, function(err, box) {
    			var total = box.messages.total;
				logger.info('You have %s total messages and %s new messages', total, box.messages.new);

				imap.end();
    		});
    	});

    	imap.once('end', function() {
    		logger.info('Bye');
    	});

    	imap.connect();
    };

    return {
    	getHeaders: getHeaders
    };
}