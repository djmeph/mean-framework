var mongoose = require('mongoose');

var HitSchema = new mongoose.Schema({
  useragent: { type: String, index: true },
  address: { type: String, index: true },
  Link: { type: mongoose.Schema.ObjectId, ref: 'Link', require: true, index: true },
  timestamp: { type: Date, default: Date.now, require: true, index: true }
});

module.exports = mongoose.model('Hit', HitSchema);