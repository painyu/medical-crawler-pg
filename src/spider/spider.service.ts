import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spider } from './entities/spider.entity';
import { Like, Repository } from 'typeorm';
import { ResultData } from '../common/utils/result';
import { QuerySpiderPageDto } from './dto/query.spider.page.dto';

@Injectable()
export class SpiderService {

  constructor(
    @InjectRepository(Spider)
    private readonly spiderRepository: Repository<Spider>,
  ) { }

  async findSpiderListPage(pageReq: QuerySpiderPageDto): Promise<ResultData> {
    const { page, keyword, country, address } = pageReq
    let spiderList = await this.spiderRepository.createQueryBuilder('spider_website')
      .where({
        ...(keyword ? { keywords: Like(`%${keyword}%`) } : null),
        ...(country ? { country: Like(`%${country}%`) } : null),
        ...(address ? { address: Like(`%${address}%`) } : null),
      })
      .skip(page)
      .take(5).getManyAndCount();
    return ResultData.ok({ list: spiderList[0], total: spiderList[1] });
  }
}
