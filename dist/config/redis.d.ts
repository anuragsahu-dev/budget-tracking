import Redis from "ioredis";
export declare const bullmqConnection: {
    host: string;
    port: number;
    maxRetriesPerRequest: null;
};
declare const redis: Redis;
export default redis;
