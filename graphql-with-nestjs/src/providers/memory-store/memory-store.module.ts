import { Module } from '@nestjs/common'
import { RedisModule} from '@nestjs-modules/ioredis'
import { redisForMSConfig } from './redis/redis.config';

@Module({
    imports: [
    RedisModule.forRoot(redisForMSConfig)
    ],
})
export class RedisProviderModule {}