const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { lat: Number, lng: Number },
  address: {type: String},
  description: { type: String },
  image: { type: String, trim: true, required: false },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', eventSchema);
