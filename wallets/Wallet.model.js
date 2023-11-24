const mongoose = require("mongoose");

const stringSchema = {
  unique: true,
  type: String,
  required: true,
  trim: true,
};

const walletSchema = new mongoose.Schema({
  userId: stringSchema,

  mainWallet: {
    type: Number,
    default: 0,
  },

  reserveWallet: {
    type: Number,
    default: 0,
  },
  
  status: {
    type: Number,
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const wallet = mongoose.model("wallets", walletSchema);

module.exports = wallet;
