'use strict';

var express = require('express'),
    http = require('http'),
    log4js = require('log4js');

var app = express();
// app.use(express.logger());

// Configuration

log4js.configure({
    appenders: [
        { type: 'console',
          category: 'dev' },
        { type: 'file',
          filename: 'logs/server.log',
          category: 'svard-mail-server',
          maxLogSize: 10240,
          backups: 3 }
    ]
});

// var logger = log4js.getLogger('svard-mail-server');
var logger = log4js.getLogger('dev');
logger.setLevel('DEBUG');

app.configure(function(){
    app.set('views', __dirname + '/app');
    //app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(app.router);
    app.engine('html', require('ejs').renderFile);
});

require('./routes/routes')(app, logger);

var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function() {
    logger.info('Listening on ' + port);
});
