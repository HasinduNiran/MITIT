// models/User.js
// Mongoose schema for the User document.
// Passwords are stored as bcrypt hashes — never in plain text.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Creates a MongoDB unique index
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in query results by default
    },
  },
  {
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true,
  }
);

// ─── Pre-save Hook ───────────────────────────────────────────────────────────
// Runs before every .save() call.
// Only re-hashes if the password field was actually modified,
// avoiding double-hashing on non-password updates.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Salt rounds = 12 (per spec); higher = more secure but slower
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method ─────────────────────────────────────────────────────────
// Compares a plain-text candidate password against the stored hash.
// Used in the login controller. bcryptjs.compare() is timing-safe.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
