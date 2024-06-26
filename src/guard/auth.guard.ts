import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANON } from 'src/decorators/allow-anon.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    // 实例化 jwtService
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            return true;
        }
        // 获取请求的内容
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            // 生成token 通过 jwtService.verifyAsync 
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: '766f37b0-2ddc-11ef-8e42-4b44796b1331'
                }
            );
            request['user'] = payload;
        } catch (err) {
            throw new UnauthorizedException();
        }
        console.log("token 验证通过啦   哈哈哈哈哈")
        return true;
    }

    // 通过 请求头拿到 token
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}