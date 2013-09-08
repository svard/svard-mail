'use strict';

describe('ComposeDirectives', function () {

    // load the directive's module
    beforeEach(module('svardMailApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        scope.body = {text: 'The mail body text'};
        element = angular.element('<editable ng-model="body.text"></editable>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should data-bind from model to view', function () {
        expect(element.text()).toEqual(scope.body.text);
    });
});
