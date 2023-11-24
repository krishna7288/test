const mongoose = require("mongoose");


const NumberUniqueSchema = {
  type: Number,
  required: true,
  unique: true,

};

const NumberSchema = {
  type: Number,
  required: true,
};

const StringSchema = {
  type: String,
  required: true,
  trim: true,
};

const slotSchema = new mongoose.Schema({
  slot_id: NumberUniqueSchema,
  userId: StringSchema,
  slotPlan_id: NumberSchema,
  slot_plan: NumberSchema,
  no_of_slots: NumberSchema,
  total_amt: NumberSchema,
  status: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});



const slot = mongoose.model("slots", slotSchema);
module.exports = slot;
