import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResultData } from "../common/utils/result";
import { CreateSignDto } from "./dto/create-sign.dto";
import { AllowAnon } from "src/decorators/allow-anon.decorator";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    /**
     * 刷新token
     * @param req 
     * @returns 
     */
    @AllowAnon()
    @Post('/signIn')
    async signIn(@Body() req: CreateSignDto): Promise<ResultData> {
        return await this.authService.signIn();
    }
}