var should = require('chai').should(),
    log4js = require('log4js'),
    Imap = require('imap');

describe('Mail', function(){

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
        Mail = require('../../modules/Mail')(logger, Imap);
    });

    it('should not be undefined', function(){
        Mail.should.not.be.undefined;
    });

    describe('#getHeaders()', function(){

        it('should receive an array of headers', function(done){
            Mail.getHeaders(1, 3).then(function(headers) {
                headers.should.be.an('array');
                headers.should.have.length(3);
                done();
            },function(err) {
                done(err);
            });
        });

        it('should throw on negative start value', function(done){
            Mail.getHeaders(-1, 1).then(function(headers) {

            }, function(err) {
                err.message.should.equal('Start point out of bounds');
                done();
            });
        });
    });
});