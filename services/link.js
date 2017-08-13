var Q = require('q');
var Link = require('../models/link');
var service = {};

service.get = get;

module.exports = service;

function get (slug) {

    var deferred = Q.defer();

    try {

        Link
        .findOne({ slug: slug })
        .exec(function (err, link) {
            if (link) deferred.resolve(link);
            else deferred.reject(err);
        });

    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
        deferred.reject(err.message);
    }

    return deferred.promise;

}