import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { ResultData } from '../common/utils/result';
import { QueryTypeDto } from './dto/query.type.dto';
import { QuerySpiderPageDto } from './dto/query.spider.page.dto';
import { FileInterceptor, } from '@nestjs/platform-express';
import { ExcelService } from 'src/excel/excel.service';
@Controller('spider')
export class SpiderController {
  constructor(
    private readonly spiderService: SpiderService,
    private readonly excelService: ExcelService
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
  // ======================================www.europages.cn===============================================
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
  @Get('/garse/getCompanyData')
  async getCompanyData(): Promise<ResultData> {
    this.spiderService.getCompanyData();
    return ResultData.ok();
  }
  /**
   * 获取公司手机号码
   * @returns 
   */
  @Get('/garse/updatePhone')
  async updatePhone(): Promise<ResultData> {
    return await this.spiderService.updatePhone();
  }

  // ======================================www.sensata.com.cn===============================================

  /**
   * 根据地址爬取公司信息
   * @returns 
   */
  @Get('/sensata/crawlCompanyInfo')
  async crawlCompanyInfo(): Promise<ResultData> {
    return await this.spiderService.crawlCompanyInfo();
  }


  // ======================================www.sensata.com.cn===============================================

  @Post('/garse/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file) {
    try {
      const data = await this.excelService.readExcel(file.buffer);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
