'use strict';

var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    log4js = require('log4js');

var privateKey = fs.readFileSync('./keys/site.key').toString(),
    certificate = fs.readFileSync('./keys/final.crt').toString(),
    options = {
        key: privateKey,
        cert: certificate
    };

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
https.createServer(options, app).listen(port, function() {
    logger.info('Listening on ' + port);
});
