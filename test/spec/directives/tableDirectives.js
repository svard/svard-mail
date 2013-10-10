'use strict';

describe('TableDirectives', function () {

    // load the directive's module
    beforeEach(module('svardMailApp'));

    describe('mailTable', function() {

        var element,
            scope;

        beforeEach(module('views/templates/mailTable.html'));

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.box = {
                headers: [{
                    "seqno": 8,
                    "uid": 8,
                    "flags": ["\\Seen"],
                    "date": "2013-07-21T15:33:14.000Z",
                    "subject": "testar",
                    "from": [{
                        "address": "kristofer.svard@gmail.com",
                        "name": "Kristofer Svärd"
                    }],
                    "text": "My name is Kristofer"
                }, {
                    "seqno": 9,
                    "uid": 9,
                    "flags": ["\\Seen"],
                    "date": "2013-07-22T06:18:56.000Z",
                    "subject": "Hello world",
                    "from": [{
                        "address": "kristofer.svard@ericsson.com",
                        "name": "Kristofer Svärd"
                    }],
                    "text": "Hi there\n\nThis is hello world!\n"
                }, {
                    "seqno": 10,
                    "uid": 10,
                    "flags": ["\\Recent"],
                    "date": "2013-08-06T23:35:15.000Z",
                    "subject": "Hello",
                    "from": [{
                        "address": "annieh310@yahoo.com.cn",
                        "name": "Annie Huang"
                    }],
                    "text": "Test\n"
                }]
            };
            element = angular.element('<table mail-table headers="box.headers"></table>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create a 3 rows in the table', function () {
            var rows = element.find('tbody');

            expect(rows.length).toBe(3);
        });

        it('should display one mail as unseen', function () {
            var unseenRow = element.find('.svard-mail-unseen');

            expect(unseenRow.length).toBe(1);
        });

        it('should toggle visibility of the body text', function () {
            var clickedRow = element.find('tbody tr button').eq(0),
                visibleBody = element.find('tbody').eq(0).children();

            expect(visibleBody.length).toBe(1);

            clickedRow.click();

            visibleBody = element.find('tbody').eq(0).children();
            expect(visibleBody.length).toBe(2);

            clickedRow.click();

            visibleBody = element.find('tbody').eq(0).children();
            expect(visibleBody.length).toBe(1);
        });
    });
});
