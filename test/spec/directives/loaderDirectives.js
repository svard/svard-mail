'use strict';

describe('Directive: loader', function () {

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

    var element, scope, $rootScope;

    beforeEach(inject(function ($compile, _$rootScope_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        element = angular.element('<loader></loader>');
        element = $compile(element)(scope);
    }));

    it('should toggle loader visibilty on route change', function () {
        expect(element).toHaveClass('svard-mail-hide');

        $rootScope.$emit('$routeChangeStart');
        expect(element).not.toHaveClass('svard-mail-hide');

        $rootScope.$emit('$routeChangeSuccess');
        expect(element).toHaveClass('svard-mail-hide');
    });
});