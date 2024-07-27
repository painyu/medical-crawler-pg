import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiderModule } from './spider/spider.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
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
