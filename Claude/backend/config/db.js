// config/db.js
// Handles MongoDB connection using Mongoose.
// Called once at server startup; exits process if connection fails.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Bug #1 fixed: added missing `await` so conn holds the resolved connection,
    // not a pending Promise. Without it, conn.connection.host was undefined.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Bug #2 fixed: console.err() does not exist — corrected to console.error()
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit with failure code so the process manager (PM2, Docker) can restart
    process.exit(1);
  }
};

// Bug #3 fixed: was exporting `connectDb` (lowercase d) which is undefined.
// The function is named `connectDB`, so the export must match exactly.
module.exports = connectDB;
