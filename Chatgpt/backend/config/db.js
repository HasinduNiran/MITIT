// backend/config/db.js
// MongoDB connection setup.

const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const err = new Error("MONGO_URI is not set in environment variables");
    err.statusCode = 500;
    throw err;
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== "production",
    });

    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
