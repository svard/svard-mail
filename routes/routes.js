module.exports = function(app, logger) {
	var Mail = require('../modules/Mail')(logger);

	app.get('/', function(req, resp) {
	    resp.render('index.html')
	});

	app.get('/headers/:from/:count', function(req, resp) {
	    var from = parseInt(req.params.from, 10),
	    	count = parseInt(req.params.count, 10);

	    Mail.getHeaders(from, count).then(function(headers) {
	    	resp.send(headers);
	    }, function(err) {
	    	logger.error('Can\'t fetch headers: %s, from: %s, count: %s:', err.message, from, count);
	    	resp.send(500);
	    });
	});
}