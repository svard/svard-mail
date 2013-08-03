var Mail = require('../../modules/Mail'),
    should = require('chai').should(),
    sinon = require('sinon');

describe('Mail', function(){
  
    it('should not be undefined', function(){
        Mail.should.not.be.undefined;
    });

    describe('#getHeaders()', function(){
        var spy = sinon.spy();
    });
});