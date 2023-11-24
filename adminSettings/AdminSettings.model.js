const mongoose = require("mongoose");

const NumberSchema = {
  type: Number,
};

const StringsSchema = {
  type: String,
};
const StringsUniqueSchema = {
  type: String,
  unique: true,
};

const StatusSchema = {
  type: Boolean,
  default: false,
};

const adminSettingsSchema = new mongoose.Schema({
  admin_id: StringsUniqueSchema,
  club_joining_fee: NumberSchema,
  withdraw_fee: NumberSchema,
  internal_transaction_fee: NumberSchema,
  spacer: NumberSchema,
  withdraw_interval: NumberSchema,
  allow_new_signup: StatusSchema,
  allow_new_fcslot: StatusSchema,
  maintenance_mode: StatusSchema,
  referral_comm_firstslot: NumberSchema,
  referral_comm_futureslot: NumberSchema,
  change_password: StringsSchema,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const adminSettings = mongoose.model("adminsettings", adminSettingsSchema);
module.exports = adminSettings;
