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
                    if ($scope.sortingOrder === newSortOrder) {
                        $scope.reverse = !$scope.reverse;
                    }
                    $scope.sortingOrder = newSortOrder;

                    var columns = angular.element(element.children().eq(0)).find('i');
                    angular.forEach(columns, function(column) {
                        angular.element(column).removeClass('icon-caret-up icon-caret-down').addClass('icon-sort');
                    });

                    switch($scope.sortingOrder) {
                        case 'from[0].name':
                            if ($scope.reverse) {
                                angular.element(columns[0]).removeClass('icon-sort').addClass('icon-caret-up');
                            } else {
                                angular.element(columns[0]).removeClass('icon-sort').addClass('icon-caret-down');
                            }
                            break;
                        case 'subject':
                            if ($scope.reverse) {
                                angular.element(columns[1]).removeClass('icon-sort').addClass('icon-caret-up');
                            } else {
                                angular.element(columns[1]).removeClass('icon-sort').addClass('icon-caret-down');
                            }
                            break;
                        case 'date':
                            if ($scope.reverse) {
                                angular.element(columns[2]).removeClass('icon-sort').addClass('icon-caret-up');
                            } else {
                                angular.element(columns[2]).removeClass('icon-sort').addClass('icon-caret-down');
                            }
                            break;
                    }
                };
            }
        };
    });