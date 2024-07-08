import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { SpiderService } from 'src/spider/spider.service';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ExcelService {

  constructor(
    private readonly spiderService: SpiderService,
  ) { }

  async readExcel(file: any) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.worksheets[0];
    const resultData = [];
    worksheet.eachRow((row, rowNumber) => {
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[`column${colNumber}`] = cell.value;
      });
      resultData.push(rowData);
    });
    const result = [];
    for (let i = 0; i < resultData.length; i++) {
      result.push({
        companyId: resultData[i][`column1`],
        companyName: resultData[i][`column2`],
        companyAddress: resultData[i][`column9`],
        contactPerson: JSON.stringify({
          "phone": resultData[i][`column3`],
          'landline': ''
        }),
        website: resultData[i][`column10`],
        keywords: '医疗器械,医院,超声',
        businessScope: '医疗器械',
        emails: resultData[i][`column4`].replaceAll(',,', ',')
      })
    }
    return await this.spiderService.createBatch(result);
  }
}
