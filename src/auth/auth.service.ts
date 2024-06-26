import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResultData } from '../common/utils/result';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async signIn(): Promise<ResultData> {
        const payload = { username: "38a48120-0cb1-488b-948c-e6e2d7a6c785", sub: "766f37b0-2ddc-11ef-8e42-4b44796b1331" };
        const accessToken = `Bearer ${this.jwtService.sign(payload)}`
        return ResultData.ok(accessToken);
    }
}
