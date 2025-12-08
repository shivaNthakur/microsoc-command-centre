const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://devloper:Shiva123@cluster0.eredb3u.mongodb.net/mysterymessage";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "analyst"], default: "analyst" },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAnalyst() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const email = "analyst@example.com";
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("✅ Analyst already exists:", existing.email);
      console.log("   Email:", existing.email);
      console.log("   Role:", existing.role);
      console.log("   Approved:", existing.isApproved);
    } else {
      const hashed = await bcrypt.hash("password123", 10);
      const analyst = new User({
        email,
        password: hashed,
        name: "Test Analyst",
        role: "analyst",
        isApproved: true,
      });
      await analyst.save();
      console.log("✅ Analyst user created!");
      console.log("   Email:", analyst.email);
      console.log("   Password: password123");
      console.log("   Role:", analyst.role);
      console.log("   Approved:", analyst.isApproved);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

createAnalyst();
