# 🎮 PUBG Leaderboard API

Redis ke saath ek fast aur reliable leaderboard API jo player scores ko manage karta hai aur ranking track karta hai.

---

## 📋 Project Overview

Ye project egy **Express.js** server hai jo **Redis Sorted Sets** use karke leaderboard maintain karta hai. Players ke scores ko store, update, aur rank check kar sakte ho.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: Redis (IORedis v5.10.1)
- **Environment**: dotenv
- **Dev Tool**: Nodemon

---

## 📦 Installation

### Prerequisites
- Node.js installed
- Redis server running
- npm ya yarn package manager

### Setup Steps

1. **Clone ya project folder kholo**
```bash
cd leaderboard
```

2. **Dependencies install karo**
```bash
npm install
```

3. **.env file banao** (agar nahi hai):
```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
```

---

## 🚀 Running the Server

### Development mode (with auto-reload)
```bash
npm install -g nodemon
nodemon app.js
```

### Production mode
```bash
node app.js
```

Server start ho jayega: `http://localhost:3000`

---

## 📡 API Endpoints

### 1. **PUT /leaderboard/update** - Score Update karo
Naya player add karo ya existing player ka score update karo.

**Request:**
```json
{
  "player": "John",
  "score": 100
}
```

**Response:**
```json
{
  "message": "Leaderboard updated"
}
```

---

### 2. **POST /leaderboard/increament** - Score Increament karo
Existing player ke score mein add karo.

**Request:**
```json
{
  "player": "John",
  "score": 50
}
```

**Response:**
```json
{
  "message": " Score updated."
}
```

---

### 3. **GET /leaderboard/rank/:player** - Rank dekho
Specific player ka rank (position) check karo.

**Request:**
```
GET http://localhost:3000/leaderboard/rank/John
```

**Response:**
```json
{
  "rank": 1
}
```

---

### 4. **DELETE /leaderboard/remove/:player** - Player remove karo
Player ko leaderboard se delete karo.

**Request:**
```
DELETE http://localhost:3000/leaderboard/remove/John
```

**Response:**
```json
{
  "message": "Player removed from leaderboard"
}
```

---

## 🧪 Postman Examples

### Add Player
```
Method: PUT
URL: http://localhost:3000/leaderboard/update
Body (JSON):
{
  "player": "Player1",
  "score": 500
}
```

### Increament Score
```
Method: POST
URL: http://localhost:3000/leaderboard/increament
Body (JSON):
{
  "player": "Player1",
  "score": 50
}
```

### Get Rank
```
Method: GET
URL: http://localhost:3000/leaderboard/rank/Player1
```

### Remove Player
```
Method: DELETE
URL: http://localhost:3000/leaderboard/remove/Player1
```

---

## ⚙️ Configuration

### Environment Variables (.env)
```
REDIS_HOST=127.0.0.1        # Redis server hostname
REDIS_PORT=6379              # Redis server port
PORT=3000                    # Express server port
REDIS_PASSWORD=              # (optional) Redis password
```

### Redis Connection
App automatically Redis se connect karke "PUBG" leaderboard key use karta hai:
```javascript
const LEADERBOARD_KEY = "leaderboard:PUBG";
```

---

## 🐛 Important Notes

### ZADD Order
Redis Sorted Set mein **score pehle, player naam baad mein** aata hai:
```javascript
// ✅ Sahi
redis.zadd(LEADERBOARD_KEY, score, player)

// ❌ Galat (error aayega)
redis.zadd(LEADERBOARD_KEY, player, score)
```

### Score Format
Score hamesha **number** hona chahiye, string nahi:
```javascript
// ✅ Sahi
{ "player": "John", "score": 100 }

// ❌ Galat
{ "player": "John", "score": "100" }
```

---

## 📊 Redis Insight Verification

Redis Insight se data verify karne ke liye:
1. Redis Insight kholo
2. Apna database select karo (default: 0)
3. Search mein `leaderboard:PUBG` likho
4. Sorted Set ka data dikhega

---

## 🚨 Troubleshooting

### Problem: Redis connection error
**Solution:**
- Redis server running hai kya? `redis-cli` se check karo
- REDIS_HOST aur REDIS_PORT sahi hain?
- Redis password set hai toh .env mein add karo

### Problem: ERR value is not a valid float
**Solution:**
- Score number format mein bhejo (string nahi)
- ZADD order check karo: `zadd(key, score, player)` correct order hai

### Problem: Player not found
**Solution:**
- Player spelling exactly match hona chahiye
- leaderboard:PUBG key mein data hai kya Redis Insight mein check karo

---

## 📝 Project Structure
```
leaderboard/
├── app.js                 # Main Express server
├── package.json          # Dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
└── README.md            # Ye file!
```

---

## 🎯 Next Steps

1. ✅ Server start karo
2. ✅ Postman mein endpoints test karo
3. ✅ Redis Insight mein data verify karo
4. ✅ Production ke liye optimize karo

---

## 👨‍💻 Author
Guddu - Redis Tasks Project in Node.js

---

## 📞 Support
Kisi problem ke liye:
- Terminal mein console.log dekho
- Redis connection status check karo
- Redis Insight mein keys verify karo

---

**Happy Coding! 🚀**
