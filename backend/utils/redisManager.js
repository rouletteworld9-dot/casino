const { createClient } = require("redis");

class RedisManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (!process.env.REDIS_URL) {
      return false;
    }

    try {
      this.client = createClient({ url: process.env.REDIS_URL });
      await this.client.connect();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error("Redis connection failed:", error.message);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error.message);
      return null;
    }
  }

  async set(key, value) {
    if (!this.isConnected) return false;

    try {
      await this.client.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error.message);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;

    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }
}

module.exports = new RedisManager();
