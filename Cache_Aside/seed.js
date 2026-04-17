import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/githubCache";

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  public_repos: Number,
});

const User = mongoose.model("User", userSchema);

// Seed data
const users = [
  { username: "gaurav", public_repos: 25 },
  { username: "manish", public_repos: 40 },
  { username: "rohit", public_repos: 15 },
  { username: "virat", public_repos: 60 },
  { username: "elon", public_repos: 100 },
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ❌ old data delete (optional but recommended)
    await User.deleteMany({});
    console.log("🗑 Old data cleared");

    // ✅ insert new data
    await User.insertMany(users);
    console.log("🔥 Data seeded successfully");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();