var _ = require('underscore'),
    should = require('chai').should(),
    utils = require('../../modules/utils');

describe('utils', function() {

    describe('#validator()', function() {

        it('should attach a message to the function', function() {
            var validator = utils.validator('must be a string', _.isString);

            validator.should.have.property('message');
        });
    });

    describe('#condition()', function() {

        it('should return a function that validates each argument', function() {
            var cond = utils.condition(utils.validator('must be a string', _.isString));

            (cond.bind(null, _.identity, 42)).should.throw(Error);
            (cond.bind(null, _.identity, 'Test')).should.not.throw(Error);
        });
    });

    describe('#complement()', function() {

        it('should return the given functions complement', function() {
            var isTrue = utils.complement(function() {return false;}),
                isFalse = utils.complement(function() {return true;});

            (isTrue()).should.be.true;
            (isFalse()).should.be.false;
        });
    });

    describe('#zero()', function() {

        it('should test if argument is zero', function() {
            (utils.zero(0)).should.be.true;
            (utils.zero(5)).should.be.false;
            (utils.zero(-5)).should.be.false;
            (utils.zero('test')).should.be.false;
            (utils.zero('0')).should.be.false;
        });
    });

    describe('#negative', function() {

        it('should test if argument is less than zero', function() {
            (utils.negative(-5)).should.be.true;
            (utils.negative(0)).should.be.false;
            (utils.negative(5)).should.be.false;
            (utils.negative('test')).should.be.false;
        });
    });
});