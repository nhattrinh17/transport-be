import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductTable1749703749507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar(256)',
            isNullable: false,
            comment: 'Tên',
          },
          {
            name: 'slug',
            type: 'varchar(256)',
            isNullable: false,
            comment: 'Đường dẫn',
          },
          {
            name: 'quantity',
            type: 'integer',
            isNullable: false,
            comment: 'Số lượng',
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            comment: 'Trạng thái',
          },
          {
            name: 'price',
            type: 'integer',
            default: '0',
            comment: 'Giá',
          },
          {
            name: 'length',
            type: 'integer',
            default: '0',
            comment: 'Chiều dài',
          },
          {
            name: 'width',
            type: 'integer',
            default: '0',
            comment: 'Chiều rộng',
          },
          {
            name: 'height',
            type: 'integer',
            default: '0',
            comment: 'Chiều cao',
          },
          {
            name: 'weight',
            type: 'integer',
            default: '0',
            comment: 'Trọng lượng',
          },
          {
            name: 'createdAt',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updatedAt',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'deletedAt',
            type: 'datetime(6)',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'product',
      new TableIndex({
        name: 'IDX_product_slug',
        columnNames: ['slug'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('product', 'IDX_product_slug');
    await queryRunner.dropTable('product');
  }
}
