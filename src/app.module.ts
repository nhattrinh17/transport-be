import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import connectionSource, { typeOrmConfig } from './config/typeorm';
import { ProvinceModule } from '@modules/province/province.module';
import { FeeModule } from '@modules/fee/fee.module';
import { WarehouseModule } from '@modules/warehouse/warehouse.module';
import { OrderModule } from '@modules/order/order.module';
import { WebhookModule } from '@modules/webhook/webhook.module';
import { DashboardModule } from '@modules/dashboard/dashboard.module';
import { ProductModule } from '@modules/product/product.module';
import { TagModule } from '@modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return typeOrmConfig;
      },
      dataSourceFactory: async () => {
        const dataSource = await connectionSource.initialize();
        return dataSource;
      },
    }),
    ProvinceModule,
    FeeModule,
    WarehouseModule,
    OrderModule,
    WebhookModule,
    DashboardModule,
    ProductModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {}
}
