const { Schema, model } = require('mongoose');

const TokenSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  renewToken: {
    type: String,
    required: true,
  },
});

module.exports = model('token', TokenSchema);
