import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiderModule } from './spider/spider.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
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
    SpiderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
