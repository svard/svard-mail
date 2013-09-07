'use strict';

angular.module('svardMailApp')
    .directive('editable', function () {
        return {
            template: '<div contenteditable="true"></div>',
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            link: function postLink($scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                ctrl.$formatters.unshift(function (value) {
                    return value.replace(/\n/g, '<br />');
                });

                element.on('keyup change', function() {
                    $scope.$apply(function() {
                        ctrl.$setViewValue(element.html());
                    });
                });

                ctrl.$render = function () {
                    element.html(ctrl.$viewValue);
                };
            }
        };
    });