import Redis from "ioredis";
declare const redis: Redis;
export declare const bullmqConnection: {
    host: string;
    port: number;
    maxRetriesPerRequest: null;
};
export default redis;
