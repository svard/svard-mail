'use strict';

angular.module('svardMailApp')
    .directive('mailTable', ['Mail', function (Mail) {
        return {
            templateUrl: 'views/templates/mailTable.html',
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

                $scope.deleteMail = function() {
                    var uid = [],
                        mail = new Mail(),
                        i;

                    for(i = $scope.box.selectedMailBoxContent.messages.length - 1; i >= 0; i -= 1) {
                        if ($scope.box.selectedMailBoxContent.messages[i].delete) {
                            uid.push($scope.box.selectedMailBoxContent.messages[i].uid);
                            $scope.box.selectedMailBoxContent.totalMsgs -= 1;
                            if (_.contains($scope.box.selectedMailBoxContent.messages[i].flags, '\\Recent')) {
                                $scope.box.selectedMailBoxContent.unreadMsgs -= 1;
                            }
                            mail.$delete({mailbox: $scope.activeMailbox, uid: $scope.box.selectedMailBoxContent.messages[i].uid});
                            $scope.box.selectedMailBoxContent.messages.splice(i, 1);
                        }
                    }
                };
            }
        };
    }]);