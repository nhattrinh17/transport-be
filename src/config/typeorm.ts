import { Order, OrderDetail, OrderLog, Product, ProductTag, Tag, Warehouse, WarehouseDetail } from '@entities/index';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from 'dotenv';
config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'mysql',
  replication: {
    master: {
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    slaves: [
      {
        host: process.env.MYSQL_SLAVES_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_SLAVES_DATABASE,
      },
    ],
  },
  entities: [Warehouse, WarehouseDetail, Order, OrderDetail, OrderLog, Tag, Product, ProductTag],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: process.env.MIGRATIONS_RUN as any,
  logging: false,
};

const connectionSource = new DataSource({ ...typeOrmConfig });
export default connectionSource;
