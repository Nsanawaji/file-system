import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './file/file.module';
import { ThrottlerModule } from '@nestjs/Throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/Throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow('THROTTLER_TTL'),
          limit: configService.getOrThrow('THROTTLER_LIMIT'),
        },
      ],
      inject: [ConfigService],
    }),
    FileModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
