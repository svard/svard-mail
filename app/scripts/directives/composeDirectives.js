'use strict';

angular.module('svardMailApp')
    .directive('editable', function () {
        return {
            templateUrl: 'views/templates/editable.html',
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            link: function postLink($scope, element, attrs, ctrl) {
                var editableEl = element.find('.svard-mail-compose-editable');

                if (!ctrl) {
                    return;
                }

                ctrl.$parsers.unshift(function (value) {
                    if (value !== null) {
                        return value.replace(/&gt;/g, '>').replace(/<div>/g, '\n').replace(/<\/div>/g, '').replace(/<br>/g, '\n');
                    }
                });

                editableEl.on('keyup change', function() {
                    $scope.$apply(function() {
                        ctrl.$setViewValue(editableEl.html());
                    });
                });

                ctrl.$render = function () {
                    editableEl.html(ctrl.$viewValue);
                };

                $scope.reply = function() {
                    editableEl[0].focus();
                    $scope.formatReply();
                };

                $scope.showReplyButton = function() {
                    return attrs.reply !== undefined;
                };
            }
        };
    });