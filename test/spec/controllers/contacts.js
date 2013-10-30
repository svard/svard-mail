'use strict';

xdescribe('Controller: ContactsCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));

    var ContactsCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ContactsCtrl = $controller('ContactsCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

describe('Controller: ContactsCtrl', function () {
    // load the controller's module
    beforeEach(module('svardMailApp'));

    var ContactsCtrl,
        scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.profile = {
            savedContacts: [
                {name: 'Jane Doe', email: 'jane.doe@gmail.com', _id: 1},
                {name: 'John Doe', email: 'john.doe@gmail.com', _id: 2}
            ]
        };
        ContactsCtrl = $controller('ContactsCtrl', {
            $scope: scope,
        });
    }));

    it('should add an empty placeholder contact to the contact list', function () {
        scope.addContact();
        expect(scope.profile.savedContacts.length).toBe(3);
        expect(scope.profile.savedContacts[2].name).toEqual('');
        expect(scope.profile.savedContacts[2].email).toEqual('');
    });
});

describe('Controller: ContactCtrl', function () {
    // load the controller's module
    beforeEach(module('svardMailApp'));

    var ContactCtrl,
        scope,
        $httpBackend,
        $timeout;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$timeout_, Contact) {
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        scope = $rootScope.$new();
        scope.actionMenuStyle = {display: 'none'};
        scope.profile = {
            savedContacts: [
                {name: 'Jane Doe', email: 'jane.doe@gmail.com', _id: 1},
                {name: 'John Doe', email: 'john.doe@gmail.com', _id: undefined}
            ]
        };
        ContactCtrl = $controller('ContactCtrl', {
            $scope: scope,
            Contact: Contact
        });
    }));

    it('should delete one contact', function () {
        $httpBackend.expectDELETE('/contact/1').respond(200, '');
        expect(scope.profile.savedContacts.length).toBe(2);
        scope.deleteContact(0);
        expect(scope.profile.savedContacts.length).toBe(1);
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should save a new contact', function () {
        $httpBackend.expectPOST('/contact', {
            name: 'John Doe',
            email: 'john.doe@gmail.com'
        }).respond(201, {_id: 2});
        scope.contact = {
            name: 'John Doe',
            email: 'john.doe@gmail.com'
        };

        scope.saveContact(1);
        $httpBackend.flush();
        expect(scope.profile.savedContacts[1]._id).toBe(2);
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should update an existing contact', function () {
        $httpBackend.expectPUT('/contact/1', {
            name: 'John Smith',
            email: 'john.smith@gmail.com'
        }).respond(200, '');
        scope.contact = {
            name: 'John Smith',
            email: 'john.smith@gmail.com'
        };

        scope.saveContact(0);
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should toggle the action menu', function () {
        expect(scope.actionMenuVisible).toBe(false);
        expect(scope.actionMenuStyle.display).toEqual('none');

        scope.toggleActionMenu();

        expect(scope.actionMenuVisible).toBe(true);
        expect(scope.actionMenuStyle.display).toEqual('block');

        scope.toggleActionMenu();

        expect(scope.actionMenuVisible).toBe(false);
        expect(scope.actionMenuStyle.display).toEqual('none');
    });

    it('should toggle visibility class', function () {
        expect(scope.toggleSavedToast()).toEqual('svard-mail-contact-saved-invisible');
        scope.savedToastVisible = true;
        expect(scope.toggleSavedToast()).toEqual('svard-mail-contact-saved-visible');
    });

    it('should show a toast and then hide it again', function () {
        scope.showToast();
        expect(scope.savedToastVisible).toBe(true);
        $timeout.flush();
        expect(scope.savedToastVisible).toBe(false);
    });
});