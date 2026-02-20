// backend/models/User.js
// User model (email unique, password stored as bcrypt hash).

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
