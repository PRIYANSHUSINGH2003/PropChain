const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true },
  price: { type: Number, required: true },
  seller: { type: String, required: true },
  share: { type: Number, required: true, min: 0, max: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ListingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', ListingSchema);
