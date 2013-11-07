'use strict';

describe('Directive: autocomplete', function () {

    // load the directive's module
    beforeEach(module('svardMailApp'));
    beforeEach(module('views/templates/autocomplete.html'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.mail = {to: ''};
        scope.profile = {
            savedContacts: [{
                name: 'John Doe',
                email: 'john.doe@gmail.com'
            }, {
                name: 'Jane Doe',
                email: 'jane.doe@gmail.com'
            }]
        };

        element = angular.element('<autocomplete ng-model="mail.to" contacts="profile.savedContacts"></autocomplete>');
        element = $compile(element)(scope);
        scope.$digest();
      }));

    it('should show and hide the autocomplete field depending of focus and found contacts', function () {
        element.isolateScope().inputHasFocus = true;
        element.isolateScope().contactMatches = [1, 2];
        expect(element.isolateScope().showAutoComplete()).toBeTruthy();

        element.isolateScope().inputHasFocus = false;
        expect(element.isolateScope().showAutoComplete()).toBeFalsy();

        element.isolateScope().inputHasFocus = true;
        element.isolateScope().contactMatches = [];
        expect(element.isolateScope().showAutoComplete()).toBeFalsy();
    });

    it('should handle arrow up key press', function () {
        var event = {keyCode: 38};
        element.isolateScope().focusIndex = 1;
        element.isolateScope().checkInput(event);
        expect(element.isolateScope().focusIndex).toEqual(0);

        element.isolateScope().checkInput(event);
        expect(element.isolateScope().focusIndex).toEqual(0);
    });

    it('should handle arrow up key press', function () {
        var event = {keyCode: 40};
        element.isolateScope().focusIndex = 0;
        element.isolateScope().contactMatches = [1, 2, 3];
        element.isolateScope().checkInput(event);
        expect(element.isolateScope().focusIndex).toEqual(1);

        element.isolateScope().checkInput(event);
        expect(element.isolateScope().focusIndex).toEqual(2);

        element.isolateScope().checkInput(event);
        expect(element.isolateScope().focusIndex).toEqual(2);
    });

    it('should handle input in input element', function () {
        var input = element.find('input'),
            event = {keyCode: 45};

        input.val('Joh');
        element.isolateScope().checkInput(event);
        expect(element.isolateScope().contactMatches[0].name).toEqual('John Doe');
        expect(element.isolateScope().contactMatches[0].email).toEqual('john.doe@gmail.com');

        input.val('');
        element.isolateScope().checkInput(event);
        expect(element.isolateScope().contactMatches.length).toBe(0);
    });

    it('should handle enter press on autocomplete', function () {
        var input = element.find('input'),
            event = jQuery.Event('keypress');
        event.keyCode = 13;
        element.isolateScope().contactMatches = [{
            name: 'John Doe',
            email: 'john.doe@gmail.com'
        }, {
            name: 'Jane Doe',
            email: 'jane.doe@gmail.com'
        }];
        element.isolateScope().focusIndex = 0;

        input.trigger(event);
        expect(input.val()).toEqual('John Doe <john.doe@gmail.com>');
    });
});
