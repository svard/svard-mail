'use strict';

var express = require('express'),
    http = require('http'),
    log4js = require('log4js'),
    passport = require('passport'),
    flash = require('connect-flash'),
    mongoose = require('mongoose'),
    dbPath = 'mongodb://192.168.0.108/svard_mail';

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

var Profiles = require('./modules/Profiles')(mongoose, logger);

require('./authentication/passport')(passport, Profiles);

app.configure(function(){
    app.set('views', __dirname + '/app/views');
    //app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(express.cookieParser('secret keyboard cat'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(app.router);
    app.engine('html', require('ejs').renderFile);
    mongoose.connect(dbPath, function(err) {
        if (err) {
            logger.error('Can\'t connect to mongodb: %s', err);
        }
    });
});

require('./routes/routes')(app, passport, logger);

var port = process.env.PORT || 5000;
http.createServer(app).listen(port, function() {
    logger.info('Listening on ' + port);
});
