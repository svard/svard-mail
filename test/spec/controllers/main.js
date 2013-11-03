'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
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

    it('should clear the currently loaded mailbox', function () {
        expect(scope.box).toBeDefined();
        scope.clearMailbox();
        expect(scope.box).toBeNull();
    });
});