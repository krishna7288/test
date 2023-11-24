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

const slotSchema = new mongoose.Schema({
    slotplan_id: NumberUniqueSchema,
    plan: NumberSchema,
    status: {
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

const slotplan = mongoose.model("slotplans", slotSchema);
module.exports = slotplan;

