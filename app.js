// All the interaction part will be done here api related things and we will see our leaderboard on our redis Insight

require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 3000;

//connect redis
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  db: 0,
  // password: process.env.REDIS_PASSWORD
});

// Setup a key to get the leadership
const LEADERBOARD_KEY = "leaderboard:PUBG";

app.use(express.json());

/**
 * @route PUT /leaderboad/update
 * @description Update the leaderboard
 */

app.put("/leaderboard/update", async (req, res) => {
  try {
    const { player, score } = req.body;

    if (!player || score === undefined) {
      return res.status(400).json({ message: "Player and score are required" });
    }

    await redis.zadd(LEADERBOARD_KEY, score, player);

    /**
     * ⚠️ IMPORTANT BUG NOTE (ZADD ORDER ISSUE)
     *
     * Redis Sorted Set (ZADD) ka syntax hota hai:
     *    ZADD key score member
     *
     * ❌ Galti kya thi:
     *    redis.zadd(key, player, score)
     *    → yaha "player" (string) ko Redis score samajh raha tha
     *    → score hamesha number hona chahiye
     *    → error aata hai: "ERR value is not a valid float"
     *
     * ✅ Sahi kya hai:
     *    redis.zadd(key, score, player)
     *
     * 🧠 Yaad rakhne ka rule:
     *    score = number (ranking value)
     *    member = string (player name)
     *
     * 💥 Lesson:
     *    Jab bhi Redis error aaye → check data types + argument order
     */

    // Turant verify karo
    const result = await redis.zrange(LEADERBOARD_KEY, 0, -1, "WITHSCORES");
    console.log("Current leaderboard:", result); // ← terminal mein dekho

    res.json({ message: "Leaderboard updated" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route POST /leaderboard/increament
 * @description Increament the score of a player
 */

app.post("/leaderboard/increament", async (req, res) => {
  try {
    const { player, score } = req.body;
    if (!player || !score) {
      return res.status(400).json({ message: "Player and score requrired" });
    }

    await redis.zincrby(LEADERBOARD_KEY, score, player);
    res.json({ message: " Score updated." });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route GET /leaderboard/rank/:player
 * @description Fetches the rank of a given player
 */

app.get("/leaderboard/rank/:player", async (req, res) => {
  try {
    const { player } = req.params;

    if (!player) {
      return res.status(400).json({ message: "Player is required" });
    }

    const rank = await redis.zrevrank(LEADERBOARD_KEY, player);
    res.json({ rank: rank + 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route DELETE /leaderboard/remove/:player
 * @description Remove a player from the leaderboard
 */

app.delete("/leaderboard/remove/:player", async (req, res) => {
  try {
    const { player } = req.params;

    if (!player) {
      return res.status(400).json({ message: "Player is required" });
    }

    await redis.zrem(LEADERBOARD_KEY, player);
    res.json({ message: "Player removed from leaderboard" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
