import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResultData } from "../common/utils/result";
import { CreateSignDto } from "./dto/create-sign.dto";
import { AllowAnon } from "../decorators/allow-anon.decorator";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    /**
     * 刷新token
     * @param req 
     * @returns 
     */
    @AllowAnon()
    @Get('/signIn')
    async signIn(): Promise<string> {
        return await this.authService.signIn();
    }
}