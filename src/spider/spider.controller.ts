import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { ResultData } from '../common/utils/result';
import { QuerySpiderPageDto } from './dto/query.spider.page.dto';
@Controller('spider')
export class SpiderController {
  constructor(
    private readonly spiderService: SpiderService,
  ) { }
  /**
   * 根据条件分页查询
   * @param pageReq 
   * @returns 
   */
  @Get('/garse/findSpiderListPage')
  async findSpiderListPage(@Body() pageReq: QuerySpiderPageDto): Promise<ResultData> {
    if (pageReq.keyword === undefined || pageReq.keyword === null || pageReq.keyword === '') {
      return ResultData.fail(500, "关键字不能为空");
    }
    return await this.spiderService.findSpiderListPage(pageReq);
  }
}
