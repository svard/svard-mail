'use strict';

describe('Service: MailUtils', function () {

    // load the service's module
    beforeEach(module('svardMailApp'));

    // instantiate service
    var mailUtils;
    beforeEach(inject(function(MailUtils) {
        mailUtils = MailUtils;
    }));

    it('should format an address', function () {
        expect(mailUtils.formatAddress('test', 'test@test.com')).toEqual('test <test@test.com>');
    });

    it('should format the reply subject', function () {
        expect(mailUtils.formatReplySubject('test')).toEqual('Re: test');
        expect(mailUtils.formatReplySubject('Re: test')).toEqual('Re: test');
    });

    it('should format the reply text', function () {
        var mail = {
            from: 'Kristofer Svärd <kristofer@svard.net>',
            date: new Date(2013, 10, 13),
            text: 'Test\nThis is the reply'
        };

        expect(mailUtils.formatReplyText(mail)).toEqual('\n2013/11/13 Kristofer Svärd wrote:\n> Test\n> This is the reply');
    });

    it('should parse an address', function () {
        expect(mailUtils.parseMailAddress('Kristofer Svärd <kristofer@svard.net>')).toEqual({name: 'Kristofer Svärd', address: 'kristofer@svard.net'});
        expect(mailUtils.parseMailAddress('Annie Huang <annieh310@yahoo.com.cn>')).toEqual({name: 'Annie Huang', address: 'annieh310@yahoo.com.cn'});
        expect(mailUtils.parseMailAddress('IllegalName <no.good.address>')).toEqual('');
    });
});