module.exports = (function() {
    'use strict';

    var _ = require('underscore');

    var existy = function (x) {
        return x !== null;
    };

    // var truthy = function (x) {
    //     return (x !== false) && existy(x);
    // };

    var cat = function () {
        var head = _.first(arguments);
        if(existy(head)) {
            return head.concat.apply(head, _.rest(arguments));
        }
        else {
            return [];
        }
    };

    var mapcat = function (fun, coll) {
        return cat.apply(null, _.map(coll, fun));
    };

    var validator = function (message, fun) {
        var f = function() {
            return fun.apply(fun, arguments);
        };

        f.message = message;
        return f;
    };

    var condition = function () {
        var validators = _.toArray(arguments);

        return function(fun) {
            var args = _.rest(arguments);
            var errors = mapcat(function(isValid) {
                return _.reduce(args, function(errs, arg) {
                    if (!isValid(arg)) {
                        errs.push(isValid.message);
                    }
                    return errs;
                }, []);
            }, validators);

            if (!_.isEmpty(errors)) {
                throw new Error(errors.join(', '));
            }

            return fun.apply(null, args);
        };
    };

    var complement = function (x) {
        return function() {
            return !x.apply(null, _.toArray(arguments));
        };
    };

    var zero = function (x) { return x === 0; };

    var negative = function (x) { return x < 0; };

    return {
        validator: validator,
        condition: condition,
        complement: complement,
        zero: zero,
        negative: negative
    };
})();