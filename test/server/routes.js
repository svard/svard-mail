var request = require('supertest'),
    express = require('express'),
    log4js = require('log4js'),
    should = require('chai').should();

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
    logger.setLevel('ERROR');

    beforeEach(function() {
        app = express();
        routes = require('../../routes/routes')(app, logger);
    });

    describe('GET /headers', function() {
        
        it('should respond with JSON', function(done) {
            request(app)
                .get('/headers/1/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('should handle wrong parameters', function(done) {
            request(app)
                .get('/headers/0/1')
                .expect(500, done);
        });
    });
});