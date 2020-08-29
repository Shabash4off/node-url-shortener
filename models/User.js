const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9]+$/,
  },
  hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
}, { timestamps: true });

UserSchema.methods.validPassword = function validPassword(password) {
  return bcrypt.compareSync(password, this.hash);
};

UserSchema.statics.generateHash = function generateHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

UserSchema.methods.generateJWT = function generateJWT() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    role: this.role,
    exp: exp.getTime() / 1000,
  }, process.env.SECRET);
};

UserSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    username: this.username,
    token: this.generateJWT(),
  };
};

UserSchema.methods.toProfileJSON = function toProfileJSON() {
  return {
    username: this.username,
    role: this.role,
  };
};

mongoose.model('User', UserSchema);
