const mongoose = require("mongoose");

const stringUniqueSchema = {
  type: String,
  required: true,
  unique: true,
  trim: true,
};

const stringSchema = {
  type: String,
  required: true,
  trim: true,
};

const emailSchema = {
  type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true,
};



const signupSchema = mongoose.Schema({
  name: stringSchema,
  emailId: emailSchema,
  upLineId : stringSchema,
  otp: {
    type: Number,
    required: true,
  },
  otpCreatedAt: {
    type: Date, // Store the timestamp when OTP was created
  },
});

const signup = mongoose.model("signup", signupSchema);

module.exports = signup;
