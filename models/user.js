if (process.env.NODE_ENV == 'dev') var config = require('../config.json'); else var config = {};

const SALT_WORK_FACTOR = normalize(process.env.NODE_ENV == 'dev' ? config.SALT_WORK_FACTOR : process.env.SALT_WORK_FACTOR);

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  display: { type: String, required: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number, required: false },
  recover: { type: String, required: false, index: true },
});

const reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

UserSchema.virtual('isLocked').get(isLocked);
UserSchema.pre('save', preSave);
UserSchema.methods.comparePassword = compare;
UserSchema.methods.incLoginAttempts = incLoginAttempts;
UserSchema.statics.getAuthenticated = getAuthenticated;

module.exports = mongoose.model('User', UserSchema);

//Public Functions
function isLocked () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
}

function preSave (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, genSalt);

  function genSalt (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, genHash);

    function genHash (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    }

  }

}

function compare (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, comparePassword);

  function comparePassword (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  }
}

function incLoginAttempts (cb) {
  var MAX_LOGIN_ATTEMPTS = 10;
  var LOCK_TIME = 1 * 60 * 1000;
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, cb);
  }
  var updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
}

function getAuthenticated (username, password, cb) {
  this.findOne({ $or:
    [
      { username: username },
      { email: username },
    ],
  })
  .exec(getUserAndComparePassword);

  function getUserAndComparePassword (err, user) {
    if (err) return cb(err);
    if (!user) return cb(null, null, reasons.NOT_FOUND);
    if (user.isLocked) return user.incLoginAttempts(returnLoginAttempts);

    user.comparePassword(password, comparePassword);

    function comparePassword (err, isMatch) {
      if (err) return cb(err);
      if (isMatch) {
        if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
        var updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        return user.update(updates, returnUserOrError);
      }

      user.incLoginAttempts(returnLoginAttempts);

    }

    function returnUserOrError (err) {
      if (err) return cb(err);
      return cb(null, user);
    }

    function returnLoginAttempts (err) {
      if (err) return cb(err);
      return cb(null, null, reasons.PASSWORD_INCORRECT);
    }
  }
}

// Private functions
function normalize (val) {
  var payload = parseInt(val, 10);
  if (isNaN(payload)) return val;
  if (payload >= 0) return payload;
  return false;
}





