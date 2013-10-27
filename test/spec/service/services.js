'use strict';

describe('Service: services', function () {

    // load the service's module
    beforeEach(module('svardMailApp'));
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    // instantiate service
    var mailbox, loader, mockBackend;
    beforeEach(inject(function(_$httpBackend_, MailboxLoader) {
        loader = MailboxLoader;
        mockBackend = _$httpBackend_;
    }));

    it('should load mails in mailbox and number of total and unread messages', function () {
        mockBackend.expectGET('/message/INBOX').respond({totalMsgs: 3, unreadMsgs: 0, selectedMailBoxContent: { messages: [
        // mockBackend.expectGET('../../mockmail.json?mailbox=INBOX').respond({totalMsgs: 3, unreadMsgs: 0, selectedMailBoxContent: { messages: [
            {
                "seqno": 1,
                "uid": 1,
                "flags": ["\\Seen"],
                "date": "2013-07-17T15:23:53.000Z",
                "subject": "Re: test",
                "from": [{
                    "address": "kristofer.svard@gmail.com",
                    "name": "Kristofer Svärd"
                }]
            }, 
            {
                "seqno": 2,
                "uid": 2,
                "flags": ["\\Seen"],
                "date": "2013-07-17T16:00:19.000Z",
                "subject": "Re: Can I send?",
                "from": [{
                    "address": "kristofer.svard@gmail.com",
                    "name": "Kristofer Svärd"
                }]
            }, 
            {
                "seqno": 3,
                "uid": 3,
                "flags": ["\\Seen"],
                "date": "2013-07-17T16:17:02.000Z",
                "subject": "First mail",
                "from": [{
                    "address": "kristofer.svard@gmail.com",
                    "name": "Kristofer Svärd"
                }]
            }
        ]}});

        var promise = loader('INBOX');
        promise.then(function(result) {
            mailbox = result;
        });

        expect(mailbox).toBeUndefined();

        mockBackend.flush();

        expect(mailbox.totalMsgs).toBe(3);
        expect(mailbox.unreadMsgs).toBe(0);
        expect(mailbox.selectedMailBoxContent.messages.length).toBe(3);
    });

});
