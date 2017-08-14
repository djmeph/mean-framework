var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  slug: { type: String, require: true, index: { unique: true } },
  url: { type: String, require: true, index: { unique: true } },
  created: { type: Date, require: true, default: Date.now, index: true }
});

module.exports = mongoose.model('Link', LinkSchema);