import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }
    async verifyToken(accessToken: string) {

    }

    async validateUser(payload: { id: number }): Promise<string> {
        return "";
    }

    async updateToken() {
        const accessToken = `Bearer ${this.jwtService.sign(payload)}`
        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('jwt.refreshExpiresIn') })
        return { accessToken, refreshToken }
    }
}
