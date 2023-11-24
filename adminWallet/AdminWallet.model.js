const mongoose = require("mongoose");

const NumberSchema = {
  type: Number,
  default: 0,
};

const StringsUniqueSchema = {
  type: String,
  unique: true,
  required: true,
};

const adminWalletSchema = new mongoose.Schema({
  admin_wallet_balance: NumberSchema,
  admin_commision: NumberSchema,
  admin_id: StringsUniqueSchema,

  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const adminWallet = mongoose.model("adminwallet", adminWalletSchema);
module.exports = adminWallet;
