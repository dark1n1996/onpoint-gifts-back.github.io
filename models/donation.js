const mongoose = require('mongoose');
const validator = require('validator');

const donationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  competence: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
});

module.exports = mongoose.model('donat', donationSchema);
