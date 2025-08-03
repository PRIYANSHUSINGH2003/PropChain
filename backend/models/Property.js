const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  share: { type: Number, required: true, min: 0, max: 1 },
}, { _id: false });

const PropertySchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true },
  owners: { type: [OwnerSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
