const { Schema, model } = require('mongoose');

const TrackingProductSchema = Schema({
  key: {
    type: String,
    required: true,
  },
  subscribers: {
    type: [String],
  },
  botSubscribers: {
    type: [String],
  },
  charts: {
    type: [Object],
  },
  extended_name: {
    type: String,
  },
  description: {
    type: String,
  },
  rating: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  priceMin: {
    type: String,
  },
  lastPrice: {
    type: Number,
  }
});

module.exports = model('tracked-product', TrackingProductSchema);
