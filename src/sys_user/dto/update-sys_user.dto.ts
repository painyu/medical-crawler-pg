import { PartialType } from '@nestjs/mapped-types';
import { CreateSysUserDto } from './create-sys_user.dto';

export class UpdateSysUserDto extends PartialType(CreateSysUserDto) {}
