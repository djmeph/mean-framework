var Q = require('q');
var Link = require('../models/link');
var service = {};

service.get = get;
service.getLinks = getLinks;
service.post = post;

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

function getLinks (_id) {

    var deferred = Q.defer();

    try {

        Link
        .find({ User: _id })
        .populate({
            path: 'Hits',
            select: '-_id'
        })
        .sort("-created")        
        .exec(function (err, links) {
            if (links) deferred.resolve(links);
            else deferred.reject(err);
        });

    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
        deferred.reject(err.message);
    }

    return deferred.promise;

}

function post (_id, url) {

    var deferred = Q.defer();

    try {

        var link = new Link({
            User: _id,
            url: url,
            slug: 'xy'.replace(/[xy]/g, function (c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            })
        });

        link.save(function (err, doc) {
            if (err) deferred.reject(err);
            else deferred.resolve(doc);
        });

    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
        deferred.reject(err.message);
    }

    return deferred.promise;

}