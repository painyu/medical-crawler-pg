import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiderModule } from './spider/spider.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    RedisModule.forRoot({
      // "options": {
      //   host: 'https://',
      //   port: 6379,
      //   username: 'default',
      //   password: 'AXhfAAIncDE2NzdlYjA5OGU4OTQ0YmRhYjQ5Y2NmNmY0MmEyZDBhNnAxMzA4MTU',
      //   db: 3,
      // },
      type: 'single',
      //url: 'redis://default:GS6YZeKWZEssyDPM@124.222.87.83:6379',
      options: {
        host: '124.222.87.83',
        password: 'GS6YZeKWZEssyDPM',
        db: 10,
        port: 6379
      }
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '124.222.87.83',
      port: 3306,
      username: 'medical',
      password: 'KGdGemeAn788B82n',
      database: 'medical',
      entities: [`${__dirname}/**/*.entity{.ts}`],
      autoLoadEntities: true,
      keepConnectionAlive: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      // logger: "file",
      ssl: true,
      extra: {
        sslmode: 'require'
      }
    }),
    SpiderModule,
    AuthModule,
  ],
  providers: [
    AppService
  ],
  controllers: [AppController],
})
export class AppModule { }
