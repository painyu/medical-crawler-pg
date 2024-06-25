import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { CreateSpiderDto } from './dto/create-spider.dto';
import { UpdateSpiderDto } from './dto/update-spider.dto';
import { ResultData } from '../common/utils/result';

@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) { }


  @Get('/garse/findSpiderListPage')
  async findSpiderListPage(@Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('keyword') keyword: string,): Promise<ResultData> {
    return await this.spiderService.findSpiderListPage(page, limit, keyword);
  }
  /**
   * 根据地址爬取公司信息
   * @returns 
   */
  @Get('/garse/crawlCompanyInfoByAddress')
  async crawlCompanyInfoByAddress(): Promise<ResultData> {
    return await this.spiderService.crawlCompanyInfoByAddress();
  }
  /**
   * 爬取公司的规模，类别，创建时间等信息
   */
  @Get('/garse/getCompanyData')
  async getCompanyData(): Promise<ResultData> {
    return await this.spiderService.getCompanyData();
  }
  /**
   * 获取公司手机号码
   * @returns 
   */
  @Get('/garse/updatePhone')
  async updatePhone(): Promise<ResultData> {
    return await this.spiderService.updatePhone();
  }
}
