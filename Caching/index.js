import redis from "redis";
import express from "express";

const USER_NAME = "username";
const PORT = 3000;
const REDIS_PORT = 6379;

// Create the redis client (UPDATED)
const client = redis.createClient();
await client.connect();

const app = express();

function formatOutput(username, numOfRepos) {
  return `${username} has ${numOfRepos} repos`;
}

// Request data from github
async function getRepos(req, res) {
  try {
    const username = req.params[USER_NAME];

    const response = await fetch(`https://api.github.com/users/${username}`);
    const { public_repos } = await response.json();

    // Cache data to Redis
    await client.set(username, public_repos.toString());

    res.send(formatOutput(username, public_repos));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}

// Cached middleware
async function cache(req, res, next) {
  const username = req.params[USER_NAME];

  try {
    const data = await client.get(username);

    if (data !== null) {
      console.log(`Data has already been cached of ${username}.`);
      return res.send(formatOutput(username, data));
    } else {
      console.log(`This data is cached of ${username} on the spot.`);
      next();
    }
  } catch (err) {
    console.error(err);
    next();
  }
}

app.get(`/repos/:${USER_NAME}`, cache, getRepos);

app.listen(PORT, () => {
  console.log(`Server is listening on the ${PORT}`);
});
