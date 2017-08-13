var Hit = require('../models/hit');
var service = {};

service.post = post;

module.exports = service;

function post (data) {

    try {
        var hit = new Hit(data);
        hit.save(function (err, doc) {
            if (err && (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose")) console.log(err);
        });
    } catch (err) {
        if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "verbose") console.log(err);
    }

}