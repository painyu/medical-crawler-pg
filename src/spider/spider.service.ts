import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Spider } from './entities/spider.entity';
import { Any, Repository } from 'typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ResultData } from '../common/utils/result';
import { v4 as uuidv4 } from "uuid";
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { QueryTypeDto } from './dto/query.type.dto';
import { RedisConstant } from '../common/constants/redis.constant';

@Injectable()
export class SpiderService {

  constructor(
    @InjectRepository(Spider)
    private readonly spiderRepository: Repository<Spider>,
    @InjectRedis()
    private readonly redisClient: Redis

  ) { }

  async queryTypeAll(): Promise<ResultData> {
    let result = []
    let typeList = await this.redisClient.keys(RedisConstant.QUERY_TYPE + '*');
    if (typeList != undefined && typeList.length != 0) {
      for (let i = 0; i < typeList.length; i++) {
        let dto = await this.redisClient.get(typeList[i]);
        result.push(JSON.parse(dto))
      }
    }
    return ResultData.ok(result);
  }

  async queryTypeInsert(type: QueryTypeDto): Promise<ResultData> {
    await this.redisClient.set(RedisConstant.QUERY_TYPE + type.type, JSON.stringify({ "type": type.type, "name": type.name, "url": type.url }));
    return ResultData.ok();
  }

  async findSpiderListPage(page: number, limit: number, keyword: string): Promise<ResultData> {
    if (keyword === undefined || keyword === null || keyword === '') {
      return ResultData.fail(500, "关键字不能为空");
    }
    let spiderList = await this.spiderRepository.createQueryBuilder('spider_website')
      .where("keywords LIKE  :keyword", { keyword: `%${keyword}%` })
      .skip(page)
      .take(limit).getManyAndCount();
    return ResultData.ok({ list: spiderList[0], total: spiderList[1] });
  }

  async crawlCompanyInfoByAddress(queryType: number): Promise<ResultData> {
    let redisType = await this.redisClient.get(RedisConstant.QUERY_TYPE + queryType);
    if (redisType === undefined || redisType === null || redisType === '') {
      return ResultData.fail(500, "不存在该类别");
    }
    let url = JSON.parse(redisType).url;
    if (url === undefined || url === null || url === '') {
      return ResultData.fail(500, "不存在爬虫地址");
    }
    var flag = true;
    let pageNum = 1;
    while (flag) {
      let redisPage = await this.redisClient.get(RedisConstant.QUERY_TYPE_PAGE + queryType);
      if (redisPage != undefined && redisPage != null && redisPage != '') {
        pageNum = Number(redisPage);
      }
      try {
        let res = await axios.get(url + pageNum + '&mode=default');
        if (res.data != undefined && res.data.items != undefined && res.data.items.length != 0) {
          const itemMap = res.data.items.reduce((map, item) => {
            map.set(item.id, item);
            return map;
          }, new Map());
          const spider = await this.spiderRepository.createQueryBuilder().where("company_id IN (:...companyIds)", { companyIds: Array.from(itemMap.keys()) }).getMany();
          let spiderMap = new Map();
          if (spider != null && spider.length != 0) {
            spiderMap = spider.reduce((map, obj) => {
              map.set(obj.companyId, obj);
              return map;
            }, new Map());
          }
          let result = [];
          itemMap.forEach((value, key) => {
            if (!spiderMap.get(key)) {
              result.push(value);
            }
          });
          if (result.length != 0) {
            for (let j = 0; j < result.length; j++) {
              this.spiderRepository.createQueryBuilder()
                .insert()
                .into(Spider)
                .values({
                  companyId: result[j].id,
                  companyUrl: result[j].url,
                  companyName: result[j].name,
                  companyAddress: JSON.stringify(result[j].address)
                }).execute()
                .catch((err) => {
                  console.log(err)
                });
            }
            console.log("====================插入 结束 页码 : " + pageNum + "========================  插入行数" + result.length)
          }
          pageNum += 1;
          await this.redisClient.set(RedisConstant.QUERY_TYPE_PAGE + queryType, pageNum);
        } else {
          flag = false
        }
      } catch {
        await this.redisClient.set(RedisConstant.QUERY_TYPE_PAGE + queryType, pageNum);
      }
    }
    console.log("====================== 方法 crawlCompanyInfoByAddress  执行完成==============================")
    return ResultData.ok();
  }

  async getCompanyData(): Promise<ResultData> {
    var flag = true;
    let pageNum = 1;
    let pageSize = 50;
    try {
      while (flag) {
        let spiderList = await this.spiderRepository.createQueryBuilder().where("keywords = ''").skip((pageNum - 1) * pageSize)
          .take(pageSize).orderBy({ id: 'DESC' }).getMany();
        if (spiderList != undefined && spiderList.length != 0) {
          for (let i = 0; i < spiderList.length; i++) {
            let spider = spiderList[i];
            //console.log('https://www.europages.cn' + spider.companyUrl)
            try {
              const res = await axios.get('https://www.europages.cn' + spider.companyUrl);
              //const res = await axios.get('https://www.europages.cn/ATLANTIC-CHEMICALS-TRADING-GMBH/DEU269040-00101.html');
              let $ = cheerio.load(res.data)
              const linkElement = $('.ep-epages-home-links__websites a');
              // 提取 href 属性
              const href = linkElement.attr('href');
              const companyEstablished = $('li.ep-epages-business-details-year-established dd.ep-key-value__value');
              const companyEstablishedTime = companyEstablished.text().trim();
              const scaleNum = $('li.ep-epages-business-details-headcount dd.ep-key-value__value');
              const scaleNums = scaleNum.text().trim();
              const businessScope = $('li.ep-epages-business-details-main-activity dd.ep-key-value__value');
              const businessScopeStr = businessScope.text().trim();
              // 查找包含目标文本的元素
              const addressParts = [];
              $('dl.ep-epages-sidebar__info dd p').each((index, element) => {
                const text = $(element).text().trim().replace(/^\s+|\s+$/g, '');
                if (text) {
                  addressParts.push(text);
                }
              });
              // 组装地址字符串
              const companyAddress = addressParts.join(' | ');
              const keywords = $('li.ep-keywords__list-item').map((index, element) => {
                return $(element).text().trim();
              }).get();
              console.log(keywords)
              await this.spiderRepository.createQueryBuilder()
                .update(
                  {
                    companyAddress: companyAddress,
                    businessScope: businessScopeStr,
                    scaleNum: scaleNums,
                    website: href,
                    companyEstablished: companyEstablishedTime,
                    keywords: keywords.length === 0 ? '000000' : keywords.join(', ')
                  }
                ).where({ id: spider.id })
                .execute()
                .catch((err) => {
                  console.log("============错误============", err)
                });
              console.log('=============================结束:========= ' + spider.id)
            } catch {
              continue;
            }
          }
        }
        pageNum = pageNum + 1;
        if (spiderList === undefined || spiderList.length === 0) {
          flag = false;
        }
      }
    } catch (err) {
      console.log("============================重新调用 解析网页==============================")
      this.getCompanyData()
    }
    return ResultData.ok();
  }

  async updatePhone(): Promise<ResultData> {
    var flag = true;
    let pageNum = 0;
    let pageSize = 50;
    try {
      while (flag) {
        let spiderList = await this.spiderRepository.createQueryBuilder()
          .where("contact_person = ''")
          .skip(pageNum)
          .take(pageSize)
          .orderBy({ "create_time": "ASC" })
          .getMany();
        if (spiderList != undefined && spiderList.length != 0) {
          let myMap = new Map();
          for (let i = 0; i < spiderList.length; i++) {
            let spider = spiderList[i];
            if (spider.contactPerson === undefined || spider.contactPerson === '' || spider.contactPerson === null) {
              let phoneNumber = "";
              let landline = "";
              const phoneRes = await axios.get('https://www.europages.cn/ep-api/v2/epages/' + spider.companyId + '/phones')
              if (phoneRes.data != undefined && phoneRes.data.phones != undefined && phoneRes.data.phones.length != 0 && phoneRes.data.phones[0].items != undefined && phoneRes.data.phones[0].items.length != 0) {
                phoneRes.data.phones[0].items.forEach(phone => {
                  if (phone.type === 1) {
                    phoneNumber = phone.number
                  } else {
                    landline = phone.number
                  }
                })
                myMap.set(spider.id, JSON.stringify({
                  "phone": phoneNumber,
                  'landline': landline
                }))
              } else {
                myMap.set(spider.id, '000000')
              }
            }
          }
          this.updatePhoneById(myMap);
        }
        pageNum = pageNum + 1;
        if (spiderList === undefined || spiderList.length === 0) {
          flag = false;
        }
      }
    } catch (err) {
      console.log("=================重新调用===================" + err)
      this.updatePhone();
    }
    return ResultData.ok();
  }

  async updatePhoneById(map) {
    console.log("**************** updatePhoneById 更新开始 *******************" + map.size)
    for (const [k, v] of map) {
      await this.spiderRepository.createQueryBuilder()
        .update(
          {
            contactPerson: v,
          }
        ).where({ id: k })
        .execute()
        .catch((err) => {
          console.log("============错误============", err)
        });
    }
    console.log("**************** updatePhoneById 更新 结束 *******************")
  }

  async crawlCompanyInfo(): Promise<ResultData> {
    var flag = true;
    let pageNum = 0;
    let url = "https://www.sensata.com.cn/locations/representatives?page=";
    while (flag) {
      try {
        const res = await axios.get(url + pageNum);
        let $ = cheerio.load(res.data)
        // 提取公司名称和产品信息
        const companyInfo = [];
        $('table tbody tr').each((index, element) => {
          const companyName = $(element).find('td.views-field-title h4').text().trim();
          const products = [];
          $(element).find('td.views-field-title ul li span').each((i, el) => {
            products.push($(el).text().trim());
          });
          const brands = [];

          $(element).find('td.views-field-name-3 ul li').each((i, el) => {
            brands.push($(el).text().trim());
          });
          const country = $(element).find('td.views-field-field-country .country').text().trim();
          const phone = $(element).find('td.views-field-field-phone-number .phone-wrapper a').text().trim();
          let website = '';
          if ($(element).find('td.views-field-field-website a.website-link.link').attr('href') != undefined) {
            website = $(element).find('td.views-field-field-website a.website-link.link').attr('href').trim();
          }
          companyInfo.push({
            companyName,
            products,
            brands,
            country,
            phone,
            website,
          });
        });
        if (companyInfo === undefined || companyInfo.length === 0) {
          flag = false;
          continue;
        }
        for (let i = 0; i < companyInfo.length; i++) {
          await this.spiderRepository.createQueryBuilder()
            .insert()
            .into(Spider)
            .values({
              companyId: uuidv4(),
              companyName: companyInfo[i].companyName,
              position: companyInfo[i].country,
              keywords: companyInfo[i].products.join(', '),
              product: companyInfo[i].brands.join(', '),
              website: companyInfo[i].website
            }).execute()
            .catch((err) => {
              console.log(err)
            });
        }
      } catch {
        flag = false;
      }
      pageNum += 1;
      console.log(pageNum)
    }
    return ResultData.ok();
  }
}
