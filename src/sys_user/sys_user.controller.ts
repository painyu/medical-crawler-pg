import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SysUserService } from './sys_user.service';
import { CreateSysUserDto } from './dto/create-sys_user.dto';
import { UpdateSysUserDto } from './dto/update-sys_user.dto';
import { AllowAnon } from 'decorators/allow-anon.decorator';
import { ResultData } from 'src/common/utils/result';

@Controller('sys-user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) { }

  /**
   * 用户注册
   * @param user 
   * @returns 
   */
  @Post('register')
  @AllowAnon()
  async create(@Body() user: CreateSysUserDto): Promise<ResultData> {
    return await this.sysUserService.create(user, undefined)
  }
  /**
   * 登录
   * @param dto 
   * @returns 
   */
  @Post('login')
  @AllowAnon()
  async login(@Body() dto: LoginUser): Promise<ResultData> {
    return await this.sysUserService.login(dto.email, dto.password)
  }
  /**
   * 刷新token
   * @param req 
   * @returns 
   */
  @Post('/logout')
  async updateToken(@Req() req): Promise<ResultData> {
    return await this.sysUserService.updateToken(req.user.user_id)
  }
}
