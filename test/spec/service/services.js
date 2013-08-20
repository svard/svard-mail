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
    var headers, loader, mockBackend;
    beforeEach(inject(function(_$httpBackend_, HeaderLoader) {
        loader = HeaderLoader;
        mockBackend = _$httpBackend_;
    }));

    it('should load headers and number of total and unread messages', function () {
        // mockBackend.expectGET('/headers/start/1/count/3').respond({totalMsg: 3, unreadMsg: 0, headers: [
        mockBackend.expectGET('../../mockmail.json?count=3&start=1').respond({totalMsg: 3, unreadMsg: 0, headers: [
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
        ]});

        var promise = loader(1, 3);
        promise.then(function(h) {
            headers = h;
        });

        expect(headers).toBeUndefined();

        mockBackend.flush();

        expect(headers.totalMsg).toBe(3);
        expect(headers.unreadMsg).toBe(0);
        expect(headers.headers.length).toBe(3);
    });

});
