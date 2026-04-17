import dotenv from "dotenv";
dotenv.config();

import redis from "redis";
import express from "express";
import mongoose from "mongoose";

const USER_NAME = "username";
const PORT = 3000;
const REDIS_PORT = 6379;
const CACHE_EXPIRY = 3600;

// 🔴 Redis Client
const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: REDIS_PORT,
  },
});

client.on("error", (err) => console.error("Redis Error:", err));

await client.connect();
console.log("✅ Connected to Redis");

// 🟢 MongoDB Atlas Connection
await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected to MongoDB Atlas");

// 🧱 Schema
const userSchema = new mongoose.Schema({
  username: String,
  public_repos: Number,
});

const User = mongoose.model("User", userSchema);

const app = express();
app.use(express.json());

// 🚀 Cache Aside Logic
async function getRepos(req, res) {
  const username = req.params[USER_NAME];

  try {
    // 🔍 Cache check
    const cachedData = await client.get(username);

    if (cachedData) {
      console.log("✅ CACHE HIT");

      const data = JSON.parse(cachedData);
      return res.json({
        status: "CACHE_HIT",
        ...data,
      });
    }

    console.log("❌ CACHE MISS");

    // 🧠 DB fetch
    let user = await User.findOne({ username });
    let message = "";

    // ⚡ Auto seed if not exists
    if (!user) {
      console.log("⚡ Creating user in DB");
      message = "Fetched from MongoDB (New User Created)";

      user = await User.create({
        username,
        public_repos: Math.floor(Math.random() * 100),
      });
    } else {
      console.log("🔄 Fetched from MongoDB");
      message = "Fetched from MongoDB";
    }

    const dataToCache = {
      username: user.username,
      repos: user.public_repos,
      cachedAt: new Date().toISOString(),
    };

    // ⚡ Store in Redis
    await client.setEx(username, CACHE_EXPIRY, JSON.stringify(dataToCache));

    return res.json({
      status: "CACHE_MISS",
      message: message,
      ...dataToCache,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

// 📌 Route
app.get(`/repos/:${USER_NAME}`, getRepos);

// 🚀 Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
