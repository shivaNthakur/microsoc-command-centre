import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set. Export it first:");
  console.error("   export MONGODB_URI='your-connection-string'");
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "analyst"], default: "analyst" },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Drop problematic indexes
    try {
      const indexes = await User.collection.getIndexes();
      if (indexes["username_1"]) {
        await User.collection.dropIndex("username_1");
        console.log("ℹ️  Dropped old username index");
      }
    } catch (e) {
      // indexes may not exist, that's fine
    }

    // Create admin user
    const adminEmail = "admin@example.com";
    const adminPassword = "password123";

    // Check if admin exists
    const existing = await User.findOne({ email: adminEmail.toLowerCase().trim() });
    if (existing) {
      console.log(`⚠️  Admin user already exists: ${existing.email}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Role: ${existing.role}`);
      console.log(`   Approved: ${existing.isApproved}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
      isApproved: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Approved: ${admin.isApproved}`);
    console.log("\n🔑 Use these credentials to login:");
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: password123`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedAdmin();
