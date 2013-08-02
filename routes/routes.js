module.exports = function(app, logger) {
	var Mail = require('../modules/Mail')(logger);

	app.get('/', function(req, resp) {
	    resp.render('index.html')
	});

	app.get('/headers/:from/:count', function(req, resp) {
	    Mail.getHeaders();
	    resp.send(200);
	});
}