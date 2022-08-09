import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import * as dotenv from "dotenv";
dotenv.config();

export const redisOptions: RedisModuleOptions = {
    config:{    
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        keyPrefix: process.env.REDIS_PREFIX
    }
}