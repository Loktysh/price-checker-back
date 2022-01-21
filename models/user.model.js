const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model('user', UserSchema);
