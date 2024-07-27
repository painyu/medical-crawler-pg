import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() { }

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async getHealth(): Promise<string> {
    return 'Health check success';
  }
}
