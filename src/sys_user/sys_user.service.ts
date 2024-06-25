import { Injectable } from '@nestjs/common';
import { CreateSysUserDto } from './dto/create-sys_user.dto';
import { UpdateSysUserDto } from './dto/update-sys_user.dto';
import { Repository } from 'typeorm';
import { SysUser } from './entities/sys_user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ResultData } from 'src/common/utils/result';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class SysUserService {
  
  constructor(
    @InjectRepository(SysUser)
    private readonly sysUserRepository: Repository<SysUser>,
    private readonly jwtService: JwtService,
  ) { }


  async create(dto: CreateUserDto, userId: number): Promise<ResultData> {
    
  }

  /**
   * 登录
   * account 有可能是 帐号/手机/邮箱
   */
  async login(email: string, password: string): Promise<ResultData> {
    
  }

  async updateToken(userId: number): Promise<ResultData> {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`
    const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('jwt.refreshExpiresIn') })
    return ResultData.ok({ accessToken, refreshToken })
  }

}
