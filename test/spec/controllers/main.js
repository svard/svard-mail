'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));

    var MainCtrl,
        scope,
        mockBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
        scope = $rootScope.$new();
        mockBackend = _$httpBackend_;
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });

    it('should fetch number of total and unread mail', function () {
        expect(scope.currentMailCount.total).toBe(0);
        expect(scope.currentMailCount.unread).toBe(0);
    });
});