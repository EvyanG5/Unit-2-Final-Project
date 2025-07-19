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
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

const User = mongoose.model('User', userSchema);

module.exports = User;
