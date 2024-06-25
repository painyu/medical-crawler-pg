import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateUserDto {
    @ApiProperty({ description: '用户账号' })
    @IsNotEmpty({ message: 'account 不能为空' })
    readonly role_id: number

    @ApiProperty({ description: '密码' })
    password: string

    @ApiProperty({ description: '确认密码' })
    readonly confirmPassword: string

    @ApiProperty({ description: '邮箱', required: false })
    readonly email: string

    @ApiProperty({ description: '手机号码', required: false })
    readonly phone: string

    @ApiProperty({ description: '性别', required: false })
    readonly sex: string

    @ApiProperty({ description: '用户昵称', required: false })
    readonly nick_name:string

    @ApiProperty({ description: '状态', required: false })
    readonly status: string

}
