'use strict';

angular.module('svardMailApp')
    .directive('navToggle', function () {
        return {
            link: function postLink(scope, element) {
                var buttonElem = angular.element(element.children().eq(0)),
                    listElem = angular.element(element.children().eq(1)),

                    toggle = function() {
                        listElem.toggleClass('hide-all');
                    };

                buttonElem.bind('click', toggle);
                listElem.bind('click', toggle);
            }
        };
  });