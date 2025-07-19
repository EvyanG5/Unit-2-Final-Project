const { name } = require('ejs');
const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    required: true,
  },
  userId: {
    type: String, required: true, ref: 'User'
  }, 
  name: {
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
module.exports = mongoose.model('Item', itemSchema);

