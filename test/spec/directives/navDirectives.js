'use strict';

describe('NavDirectives', function () {

    var element,
        scope;

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

    describe('navToggle', function () {

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

        it('should toggle menu visibility on button click', function () {
            var hiddenUl = angular.element(element.children().eq(1));

            expect(hiddenUl).toHaveClass('hide-all');

            angular.element(element.children().eq(0)).triggerHandler('click');
            expect(hiddenUl).not.toHaveClass('hide-all');

            angular.element(element.children().eq(0)).triggerHandler('click');
            expect(hiddenUl).toHaveClass('hide-all');
        });
    });

    describe('navMailBoxes', function () {
        var element,
            scope,
            MainCtrl;

        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            scope.box = {mailBoxes: ["INBOX", "Sent", "Trash"]};
            element = angular.element('<nav class="ink-navigation" nav-mail-boxes box-names="box.mailBoxes"></nav>');
            element = $compile(element)(scope);
            scope.$digest();
        }));

        it('should create 3 list elements', function () {
            var listElem = angular.element(element.find('li'));

            expect(listElem.length).toBe(3);
        });
    });
});