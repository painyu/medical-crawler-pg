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
      url: 'redis://default:AX3jAAIncDFiYTBlZmE2NzEyZmU0MTQzODEwMjI5NTdmNTE1ZjIzMHAxMzIyMjc@becoming-sawfly-32227.upstash.io:6379',
      'options': {
        tls: {
          port: 6379
        }
      }
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-raspy-lab-a4hs0yal.us-east-1.aws.neon.tech',
      port: 5432,
      username: 'default',
      password: '3gxtL6uklYAO',
      database: 'verceldb',
      entities: [`${__dirname}/**/*.entity{.ts}`],
      autoLoadEntities: true,
      keepConnectionAlive: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      //logger: "file",
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
