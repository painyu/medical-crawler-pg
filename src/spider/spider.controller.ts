import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { ResultData } from '../common/utils/result';
import { QueryTypeDto } from './dto/query.type.dto';
import { AllowAnon } from 'src/decorators/allow-anon.decorator';

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
   * 查询所有的网站地址
   * @returns 
   */
  @Get('/garse/queryTypeAll')
  async queryTypeAll(): Promise<ResultData> {
    return await this.spiderService.queryTypeAll();
  }

  /**
   * 添加爬虫的网站地址
   * @param type 类别
   * @returns 
   */
  @Post('/garse/queryTypeInsert')
  async queryTypeInsert(@Body() type: QueryTypeDto): Promise<ResultData> {
    return await this.spiderService.queryTypeInsert(type);
  }

  /**
   * 根据地址爬取公司信息
   * @returns 
   */
  @Get('/garse/crawlCompanyInfoByAddress')
  async crawlCompanyInfoByAddress(@Query('queryType') queryType: number): Promise<ResultData> {
    return await this.spiderService.crawlCompanyInfoByAddress(queryType);
  }
  /**
   * 爬取公司的规模，类别，创建时间等信息
   */
  @AllowAnon()
  @Get('/garse/getCompanyData')
  async getCompanyData(): Promise<ResultData> {
    this.spiderService.getCompanyData();
    return ResultData.ok();
  }
  /**
   * 获取公司手机号码
   * @returns 
   */
  @AllowAnon()
  @Get('/garse/updatePhone')
  async updatePhone(): Promise<ResultData> {
    return await this.spiderService.updatePhone();
  }
}
