import redis from "../../config/redis";
import logger from "../../config/logger";

export class RedisService {
  private readonly JSON_PREFIX = "__JSON__:";

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const data =
        typeof value === "string"
          ? value
          : this.JSON_PREFIX + JSON.stringify(value);

      if (ttlSeconds) {
        await redis.set(key, data, "EX", ttlSeconds);
      } else {
        await redis.set(key, data);
      }
    } catch (error) {
      logger.error(`Redis SET failed [${key}]`, error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      if (!value) return null;

      if (value.startsWith(this.JSON_PREFIX)) {
        try {
          return JSON.parse(value.slice(this.JSON_PREFIX.length)) as T;
        } catch {
          return null;
        }
      }
      return value as T;
    } catch (error) {
      logger.error(`Redis GET failed [${key}]`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Redis DEL failed [${key}]`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await redis.exists(key)) === 1;
    } catch (error) {
      logger.error(`Redis EXISTS failed [${key}]`, error);
      return false;
    }
  }
}

export const redisService = new RedisService();
export default redisService;
