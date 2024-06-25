import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class LoginUser {
    @ApiProperty({ description: '邮箱' })
    @IsNotEmpty({ message: '邮箱不能为空' })
    readonly email: string

    @ApiProperty({ description: '密码' })
    @IsString({ message: 'password 类型错误' })
    @IsNotEmpty({ message: '密码不能为空' })
    readonly password: string
}
