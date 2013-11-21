'use strict';

describe('Service: services', function () {

    // load the service's module
    beforeEach(module('svardMailApp'));

    // instantiate service
    var mailbox, profile, mailboxLoader, profileLoader, stubBackend;
    beforeEach(inject(function(_$httpBackend_, MailboxLoader, ProfileLoader) {
        mailboxLoader = MailboxLoader;
        profileLoader = ProfileLoader;
        stubBackend = _$httpBackend_;
    }));

    afterEach(function () {
        stubBackend.verifyNoOutstandingExpectation();
        stubBackend.verifyNoOutstandingRequest();
        stubBackend.resetExpectations();
    });

    it('should load mails in mailbox and number of total and unread messages', function () {
        stubBackend.expectGET('/message/INBOX').respond({totalMsgs: 3, unreadMsgs: 0, selectedMailBoxContent: { messages: [
        // stubBackend.expectGET('../../mockmail.json?mailbox=INBOX').respond({totalMsgs: 3, unreadMsgs: 0, selectedMailBoxContent: { messages: [
            {
                "seqno": 1,
                "uid": 1,
                "flags": ["\\Seen"],
                "date": "2013-07-17T15:23:53.000Z",
                "subject": "Re: test",
                "from": [{
                    "address": "john.doe@gmail.com",
                    "name": "John Doe"
                }]
            }, 
            {
                "seqno": 2,
                "uid": 2,
                "flags": ["\\Seen"],
                "date": "2013-07-17T16:00:19.000Z",
                "subject": "Re: Hello there?",
                "from": [{
                    "address": "john.doe@gmail.com",
                    "name": "John Doe"
                }]
            }, 
            {
                "seqno": 3,
                "uid": 3,
                "flags": ["\\Seen"],
                "date": "2013-07-17T16:17:02.000Z",
                "subject": "First mail",
                "from": [{
                    "address": "john.doe@gmail.com",
                    "name": "John Doe"
                }]
            }
        ]}});

        var promise = mailboxLoader('INBOX');
        promise.then(function(result) {
            mailbox = result;
        });

        expect(mailbox).toBeUndefined();

        stubBackend.flush();

        expect(mailbox.totalMsgs).toBe(3);
        expect(mailbox.unreadMsgs).toBe(0);
        expect(mailbox.selectedMailBoxContent.messages.length).toBe(3);
    });

    it('should load a users profile', function () {
        stubBackend.expectGET('/profile').respond({
            profile:  { 
                _id: 1,
                contacts: [],
                name: 'John Smith',
                password: 'secret',
                username: 'User',
                roles: ['user'],
                allContacts: [],
                savedContacts: [
                    { 
                        _id: 2,
                        email: 'john.doe@gmail.com',
                        name: 'John Doe'
                    },
                    { 
                        email: 'jane.doe@gmail.com',
                        name: 'Jane Doe',
                        _id: 3,
                    }
                ]
             }
        });

        var promise = profileLoader();
        promise.then(function(result) {
            profile = result;
        });

        expect(profile).toBeUndefined();

        stubBackend.flush();

        expect(profile).toBeDefined();
        expect(_.keys(profile.profile).length).toBe(8);
    });
});
