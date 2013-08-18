'use strict';

describe('Directive: navDirectives', function () {

    // load the directive's module
    beforeEach(module('svardMailApp'));
    beforeEach(function() {
        this.addMatchers({
            toHaveClass: function(cls) {
                this.message = function() {
                    return "Expected '" + angular.mock.dump(this.actual) + "' to have class '" + cls + "'.";
                };

                return this.actual.hasClass(cls);
            }
        });
    });

    var element,
        scope;

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element(
            '<nav class="ink-navigation ink-grid hide-all show-small" nav-toggle>' +
                '<ul class="menu vertical black">' +
                    '<li>' +
                        '<button>' +
                            '<span class="icon-reorder"></span>' +
                        '</button>' +
                    '</li>' +
                '</ul>' +
                '<ul class="menu vertical black hide-all">' +
                    '<li><a href="#"><i class="icon-home"></i></a></li>' +
                    '<li><a href="#/compose"><i class="icon-pencil"></i> Write</a></li>' +
                    '<li><a href="#/contacts"><i class="icon-group"></i> Contacts</a></li>' +
                    '<li><a href="#"><i class="icon-signout"></i> Logout</a></li>' +
                '</ul>' +
            '</nav>'
        );
        element = $compile(element)(scope);
    }));

    it('should toggle menu visibility on click', inject(function ($compile) {
        var hiddenUl = angular.element(element.children().eq(1));

        expect(hiddenUl).toHaveClass('hide-all');

        angular.element(element.children().eq(0)).triggerHandler('click');
        expect(hiddenUl).not.toHaveClass('hide-all');

        angular.element(element.children().eq(0)).triggerHandler('click');
        expect(hiddenUl).toHaveClass('hide-all');
    }));
});
