'use strict';

module.exports = function(mongoose, logger) {
    var Q = require('q'),
        async = require('async');

    var Contact = new mongoose.Schema({
        email: { type: String },
        name: { type: String }
    });

    var ProfileSchema = new mongoose.Schema({
        username: { type: String, unique: true },
        password: { type: String },
        name: { type: String },
        savedContacts: [Contact],
        allContacts: [Contact],
        roles: [{ type: String }],
    });

    var Profile = mongoose.model('Profile', ProfileSchema);

    var findUserCredentials = function (username) {
        var deferred = Q.defer();

        Profile.findOne({username: username}, '_id username roles password', function (err, doc) {
            if (err) {
                logger.error('Failed to look for user %s: %s', username, err.message);
                deferred.reject(err);
                return;
            }
            deferred.resolve(doc);
        });

        return deferred.promise;
    };

    var findById = function (id) {
        var deferred = Q.defer();

        Profile.findById(id, '-__v', function (err, doc) {
            if (err) {
                logger.error('Failed to find id %s: %s', id, err.message);
                deferred.reject(err);
                return;
            }
            deferred.resolve(doc);
        });

        return deferred.promise;
    };

    var addContact = function (profileId, contact) {
        var deferred = Q.defer();

        async.waterfall([
            function (callback) {
                Profile.findById(profileId, function (err, profile) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, profile);
                });
            },

            function (profile, callback) {
                profile.savedContacts.push(contact);
                profile.save(function (err, contact) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, contact.savedContacts.pop()._id);
                });
            }
        ], function (err, contactId) {
            if (err) {
                logger.error('Failed to save contact to disk: %s', err.message);
                deferred.reject(err.message);
            } else {
                logger.debug('Saved contact %s <%s> to disk', contact.name, contact.email);
                deferred.resolve(contactId);
            }
        });

        return deferred.promise;
    };

    var deleteContact = function (profileId, contactId) {
        async.waterfall([
            function (callback) {
                Profile.findById(profileId, function (err, profile) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, profile);
                });
            },

            function (profile, callback) {
                profile.savedContacts.id(contactId).remove();
                profile.save(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                });
            }
        ], function (err) {
            if (err) {
                logger.error('Failed to remove contact id %s from profile id %s', contactId, profileId);
            }
            logger.debug('Removed contact %s', contactId);
        });
    };

    var updateContact = function (profileId, contactId, contact) {
        Profile.update({_id: profileId, 'savedContacts._id': contactId}, {$set: {'savedContacts.$.email': contact.email, 'savedContacts.$.name': contact.name}}, function (err) {
            if (err) {
                logger.error('Failed to update contact id %s from profile id %s', contactId, profileId);
            }
            logger.debug('Updated contact %s, new values %s <%s>', contactId, contact.name, contact.email);
        });
    };

    return {
        Profile: Profile,
        findUserCredentials: findUserCredentials,
        findById: findById,
        addContact: addContact,
        deleteContact: deleteContact,
        updateContact: updateContact
    };
};