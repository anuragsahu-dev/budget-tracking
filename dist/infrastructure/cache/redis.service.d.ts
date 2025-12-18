export declare class RedisService {
    private readonly JSON_PREFIX;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}
export declare const redisService: RedisService;
export default redisService;
