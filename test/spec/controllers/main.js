'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    var MainCtrl,
        scope,
        $httpBackend,
        $rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _$httpBackend_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        scope.activeMailbox = 'INBOX';
        MainCtrl = $controller('MainCtrl', {
            $scope: scope,
            mailbox: {
                totalMsg: 10,
                unreadMsg: 2,
                selectedMailBoxContent: { 
                    messages: [{
                        "seqno": 1,
                        "uid": 1,
                        "flags": ["\\Seen"],
                        "date": "2013-07-17T15:23:53.000Z",
                        "subject": "Re: test",
                        "from": [{
                            "address": "john.doe@gmail.com",
                            "name": "John Doe"
                        }]
                    }]
                }
            }
        });
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    })

    it('should clear the currently loaded mailbox', function () {
        expect(scope.box).toBeDefined();
        scope.clearMailbox();
        expect(scope.box).toBeNull();
    });

    it('should broadcast search start event', function () {
        $httpBackend.expectPOST('/search', {mailbox: 'INBOX', query: 'test string'});

        $rootScope.$on('loadingStarted', waitsFor(function () {
            return true;
        }, 'loadingStarted event never fired', 500));

        scope.searchMail();
    });

    it('should broadcast search finished event', function () {
        $httpBackend.expectPOST('/search', {mailbox: 'INBOX', query: 'test string'}).respond([]);

        $rootScope.$on('loadingFinished', waitsFor(function () {
            return true;
        }, 'loadingFinished event never fired', 500));

        runs(function () {
            $httpBackend.verifyNoOutstandingExpectation();
        });

        scope.search.query = 'test string';

        scope.searchMail();
        $httpBackend.flush();
    });

    it('should set mailbox content to search result', function () {
        $httpBackend.expectPOST('/search', {mailbox: 'INBOX', query: 'test string'}).respond([{
            "seqno": 1,
            "uid": 1,
            "flags": ["\\Seen"],
            "date": "2013-07-17T15:23:53.000Z",
            "subject": "Re: test",
            "from": [{
                "address": "john.doe@gmail.com",
                "name": "John Doe"
            }],
            "text": "test string"
        }]);

        scope.search.query = 'test string';

        scope.searchMail();
        $httpBackend.flush();

        expect(scope.box.selectedMailBoxContent.messages).toEqualData([{
            "seqno": 1,
            "uid": 1,
            "flags": ["\\Seen"],
            "date": "2013-07-17T15:23:53.000Z",
            "subject": "Re: test",
            "from": [{
                "address": "john.doe@gmail.com",
                "name": "John Doe"
            }],
            "text": "test string"
        }]);
        $httpBackend.verifyNoOutstandingExpectation();
    });
});