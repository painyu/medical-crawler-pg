import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnon } from './decorators/allow-anon.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AllowAnon()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
