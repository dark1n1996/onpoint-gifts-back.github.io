const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  starsToGiftQuantity: {
    type: Number,
    required: true,
  },
  starsToSpendQuantity: {
    type: Number,
    required: true,
  },
  isAdmin: {
    type: Boolean
  }
});

module.exports = mongoose.model('user', userSchema);
