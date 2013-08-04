var request = require('supertest'),
    express = require('express'),
    log4js = require('log4js');

describe('routes', function(){
    var routes, app;

    log4js.configure({
        appenders: [
            { type: 'console',
              category: 'test' 
            }
        ]
    });

    var logger = log4js.getLogger('test'),
        Mail;
    logger.setLevel('FATAL');

    beforeEach(function() {
        app = express();
        app.configure(function() {
            app.use(express.static(__dirname + '/../../app'));
        });
        routes = require('../../routes/routes')(app, logger);
    });

    describe('GET /', function() {

        it('should respond with index.html', function(done) {
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });
    });

    describe('GET /headers', function() {
        
        it('should respond with JSON', function(done) {
            request(app)
                .get('/headers/start/1/count/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should handle wrong parameters', function(done) {
            request(app)
                .get('/headers/start/0/count/1')
                .expect(500, done);
        });
    });

    describe('GET /message', function() {

        it('should respond with JSON', function(done) {
            request(app)
                .get('/message/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should reject uid zero', function(done) {
            request(app)
                .get('/message/0')
                .expect(500, done);
        });

        it('should reject uid less than zero', function(done) {
            request(app)
                .get('/message/-1')
                .expect(500, done);
        });
    });
});