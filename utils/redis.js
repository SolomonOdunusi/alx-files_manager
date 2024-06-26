import  { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();

    // Convert callback to promise
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('connect', () => {
        // console.log('Redis client connected to the server');
      });
  
    this.client.on('error', (error) => {
        console.log(`Redis client not connected to the server: ${error.message}`);
    });
  }
  
  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  async del(key) {
    this.client.del(key);
  }

}

const redisClient = new RedisClient();

export default redisClient;
