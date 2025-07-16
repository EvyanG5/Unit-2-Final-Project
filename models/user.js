const { name } = require('ejs');
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sellerAgreement: {
    type: Boolean,
    required: false,
},
  description: {
  type: String,
  required: true,
  },

  sold: {
    type: Boolean,
    required: false,
  },
  buy: {
    type: Boolean,
    required: false
  }

});


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
items: [itemSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
