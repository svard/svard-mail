'use strict';

angular.module('svardMailApp')
    .directive('autocomplete', ['$filter', function ($filter) {
        return {
            templateUrl: 'views/templates/autocomplete.html',
            require: '^?ngModel',
            restrict: 'E',
            scope: {
                contacts: '='
            },
            link: function postLink(scope, element, attrs, ctrl) {
                var inputEl = angular.element(element.find('input'));

                scope.inputHasFocus = false;
                scope.contactMatches = [];
                scope.focusIndex = 0;

                inputEl.on('keydown keypress', function (event) {
                    var contact;
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        contact = scope.contactMatches[scope.focusIndex].name + ' <' + scope.contactMatches[scope.focusIndex].email + '>';

                        scope.$apply(function () {
                            ctrl.$setViewValue(contact);
                        });
                        inputEl.val(contact);
                    }
                });

                ctrl.$render = function () {
                    inputEl.val(ctrl.$viewValue);
                };

                scope.checkInput = function (event) {
                    ctrl.$setViewValue(inputEl.val());
                    if (event.keyCode === 38) {
                        if (scope.focusIndex > 0) {
                            scope.focusIndex--;
                        }
                    } else if (event.keyCode === 40) {
                        if (scope.focusIndex < (scope.contactMatches.length - 1)) {
                            scope.focusIndex++;
                        }
                    } else {
                        if (inputEl.val() === '') {
                            scope.contactMatches = [];
                            return;
                        }
                        scope.contactMatches = $filter('filter')(scope.contacts, {name: inputEl.val()});
                    }
                };

                scope.showAutoComplete = function () {
                    return scope.contactMatches.length > 0 && scope.inputHasFocus;
                };
            }
        };
  }]);