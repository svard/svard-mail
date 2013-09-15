'use strict';

angular.module('svardMailApp')
    .directive('mailTable', function () {
        return {
            templateUrl: 'views/templates/mailTable.html',
            scope: {
                headers: '=headers'
            },
            link: function postLink($scope, element) {
                $scope.sortingOrder = 'date';
                $scope.reverse = true;

                $scope.sortBy = function(newSortOrder) {
                    var thClass = newSortOrder === 'from.name' ? 'from' : newSortOrder;

                    if ($scope.sortingOrder === newSortOrder) {
                        $scope.reverse = !$scope.reverse;
                    }
                    $scope.sortingOrder = newSortOrder;

                    element.find('th i').each(function() {
                        $(this).removeClass().addClass('icon-sort');
                    });

                    if ($scope.reverse) {
                        element.find('th.' + thClass + ' i').removeClass('icon-sort').addClass('icon-caret-up');
                    } else {
                        element.find('th.' + thClass + ' i').removeClass('icon-sort').addClass('icon-caret-down');
                    }
                };
            }
        };
    });