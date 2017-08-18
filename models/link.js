var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  User: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  slug: { type: String, require: true },
  url: { type: String, require: true },
  created: { type: Date, require: true, default: Date.now, index: true }
});

LinkSchema.index({ User: 1, url: 1}, { unique: true });

LinkSchema.virtual('Hits', {
  ref: 'Hit',
  localField: '_id',
  foreignField: 'Link'
});

module.exports = mongoose.model('Link', LinkSchema);