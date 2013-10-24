'use strict';

module.exports = function(mongoose, logger) {
    var Q = require('q');

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

    return {
        Profile: Profile,
        findUserCredentials: findUserCredentials,
        findById: findById
    };
};