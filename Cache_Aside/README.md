# Cache Aside Pattern (Lazy Loading) - Redis Implementation

## 📌 Pattern Explanation

**Cache Aside** (also called **Lazy Loading**) is a caching strategy where:

### Cache Hit ✅

- When data is **found in cache**, it's returned immediately without querying the data source
- **Faster response** (served from Redis)

### Cache Miss ❌

- When data is **NOT in cache**, the application:
  1. Queries the source (GitHub API)
  2. Stores the result in cache
  3. Returns the data to the client
- **Slower first request**, but subsequent requests are cached

## 🔄 How It Works

```
Request for username
    ↓
Check Redis Cache
    ↓
├─ Found (HIT) → Return from cache ✅ FAST
└─ Not Found (MISS) → Fetch from GitHub → Store in Redis → Return ❌ SLOW
```

## 🚀 Setup & Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Ensure Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

### 3. Start the Server

```bash
npm start
# Or with auto-reload
npm run dev
```

### 4. Test the Pattern

#### First Request (CACHE MISS) ❌

```bash
curl http://localhost:3000/repos/torvalds
```

Output:

```json
{
  "status": "CACHE_MISS",
  "message": "Data fetched from GitHub API and stored in cache for torvalds",
  "username": "torvalds",
  "repos": 195,
  "cachedAt": "2024-01-20T10:30:45.123Z"
}
```

Look at console: `❌ CACHE MISS: torvalds not in cache. Fetching from GitHub API...`

#### Second Request (CACHE HIT) ✅

```bash
curl http://localhost:3000/repos/torvalds
```

Output:

```json
{
  "status": "CACHE_HIT",
  "message": "Data retrieved from cache for torvalds",
  "username": "torvalds",
  "repos": 195,
  "cachedAt": "2024-01-20T10:30:45.123Z"
}
```

Look at console: `✅ CACHE HIT: Found torvalds in cache`

## ⚙️ Configuration

- **CACHE_EXPIRY**: 3600 seconds (1 hour) - Data expires after this time
- **PORT**: 3000 - Server runs on this port
- **REDIS_PORT**: 6379 - Default Redis port

## 📊 Benefits

| Aspect         | Cache Hit    | Cache Miss |
| -------------- | ------------ | ---------- |
| Speed          | ⚡ Very Fast | 🐢 Slow    |
| Source Load    | ✅ None      | ❌ Full    |
| Data Freshness | ⏱️ Delayed   | 📦 Fresh   |

## 🔧 Key Features

✅ **Automatic Cache Expiry** - Data automatically expires after 1 hour  
✅ **Error Handling** - Graceful errors with proper HTTP status codes  
✅ **Detailed Logging** - Clear HIT/MISS indicators  
✅ **Health Check** - `/health` endpoint to verify server status  
✅ **JSON Responses** - Structured responses with status indicators

## 🧪 More Test Examples

```bash
# Test different users
curl http://localhost:3000/repos/gvanrossum
curl http://localhost:3000/repos/dhh
curl http://localhost:3000/repos/invalid-user-xyz

# Check server health
curl http://localhost:3000/health
```

---

**Pattern Type**: Lazy Loading / Cache Aside  
**Best For**: Read-heavy operations with tolerable stale data
