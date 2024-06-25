import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ResultData } from "src/common/utils/result";

@Controller()
export class BaseController {

    constructor(private readonly authService: AuthService) { }
    /**
     * 刷新token
     * @param req 
     * @returns 
     */
    @Post('/logout')
    async updateToken(): Promise<ResultData> {
        return await this.authService.updateToken()
    }
}