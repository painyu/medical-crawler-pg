import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { ResultData } from '../common/utils/result';
import { QuerySpiderPageDto } from './dto/query.spider.page.dto';
import { AllowAnon } from 'src/decorators/allow-anon.decorator';
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
  @AllowAnon()
  @Post('/garse/findSpiderListPage')
  async findSpiderListPage(@Body() pageReq: QuerySpiderPageDto): Promise<ResultData> {
    if (pageReq.keyword === undefined || pageReq.keyword === null || pageReq.keyword === '') {
      return ResultData.fail(500, "关键字不能为空");
    }
    return await this.spiderService.findSpiderListPage(pageReq);
  }

  /**
   * 
    * 根据ID查询详情
    * @param id 编号
   * @returns 
   */
  @AllowAnon()
  @Get('/garse/getId/:id')
  async getId(@Param('id') id: string): Promise<ResultData> {
    return await this.spiderService.getId(id);
  }
}
