import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: Redis) { }
  async getHello(): Promise<string> {
    await this.redis.set("kkkk", "我是杨勇");
    let a = await this.redis.get('kkkk');
    console.log(a.toString());
    return 'Hello World!';
  }
}
