import { Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spider } from './entities/spider.entity';
import { ExcelService } from 'src/excel/excel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spider])],
  controllers: [SpiderController],
  providers: [SpiderService,ExcelService],
})
export class SpiderModule { }
