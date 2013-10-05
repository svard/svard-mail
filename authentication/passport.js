'use strict';

module.exports = function (passport, Profiles) {
    var LocalStrategy = require('passport-local').Strategy,
        bcrypt = require('bcrypt');

    passport.serializeUser(function (user, done) {
        done(null, {id: user.id, pw: user.password});
    });

    passport.deserializeUser(function (userObj, done) {
        var profile = Profiles.findById(userObj.id);

        profile.then(function (user) {
            user.password = userObj.pw;
            done(null, user);
        }, function (err) {
            done(err);
        });
    });

    passport.use(new LocalStrategy(function (username, password, done) {
        var profile = Profiles.findUserCredentials(username);

        profile.then(function (user) {
            if (user === null) {
                return done(null, false, {message: 'Invalid username or password'});
            }

            if (bcrypt.compareSync(password, user.password)) {
                user.password = password;
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid username or password'});
            }
        }, function (err) {
            return done(err);
        });
    }));
};