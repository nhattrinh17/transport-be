import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

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
            name: 'warehouseId',
            type: 'varchar(36)',
            isNullable: true,
            comment: 'ID kho hàng',
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

    // Add foreign key for warehouseId if needed
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['warehouseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'warehouse',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        if (fk.columnNames.indexOf('warehouseId') !== -1) {
          await queryRunner.dropForeignKey('product', fk);
        }
      }
    }

    await queryRunner.dropIndex('product', 'IDX_product_slug');
    await queryRunner.dropTable('product');
  }
}
