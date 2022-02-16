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
  trackingProducts: {
    type: [String],
  },
  telegramID: {
    type: String,
  },
  isNotificationOn: {
    type: Boolean,
  }
});

module.exports = model('user', UserSchema);
