'use strict';

angular.module('svardMailApp')
    .directive('mailTable', ['$location', function ($location) {
        return {
            templateUrl: 'views/templates/mailTable.html',
            scope: {
                headers: '=headers'
            },
            link: function postLink($scope, element) {
                $scope.sortingOrder = 'date';
                $scope.reverse = true;

                $scope.sortBy = function(newSortOrder) {
                    var thClass = newSortOrder === 'from[0].name' ? 'from' : newSortOrder;

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

                $scope.toggleBody = function(header) {
                    var mailBodyEl = element.find('tbody tr.svard-mail-uid-' + header.uid);
                    mailBodyEl.toggleClass('svard-mail-hide');
                    if (mailBodyEl.prev().find('td i').hasClass('icon-chevron-down')) {
                        mailBodyEl.prev().find('td i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                    } else {
                        mailBodyEl.prev().find('td i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                    }
                };

                $scope.isUnseen = function(header) {
                    if (_.contains(header.flags, '\\Unseen')) {
                        return 'svard-mail-unseen';
                    }
                };

                $scope.readMail = function(header) {
                    $location.path('/compose/' + header.uid);
                };
            }
        };
    }]);