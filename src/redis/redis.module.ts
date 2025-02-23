import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get('THROTTLE_TTL', 60),
            limit: config.get('THROTTLE_LIMIT', 60),
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        }),
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class RedisModule {}
