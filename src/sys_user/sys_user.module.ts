import { Module } from '@nestjs/common';
import { SysUserService } from './sys_user.service';
import { SysUserController } from './sys_user.controller';

@Module({
  controllers: [SysUserController],
  providers: [SysUserService],
})
export class SysUserModule {}
