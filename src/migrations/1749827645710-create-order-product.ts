import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrderProduct1749827645710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_product',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'productId',
            type: 'varchar(36)',
            isNullable: false,
            comment: 'ID sản phẩm',
          },
          {
            name: 'orderId',
            type: 'varchar(36)',
            isNullable: false,
            comment: 'ID đơn hàng',
          },
          {
            name: 'quantity',
            type: 'int',
            default: '1',
            comment: 'Số lượng sản phẩm trong đơn hàng',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_product',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_product',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'order',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_product');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('order_product', fk);
      }
    }

    await queryRunner.dropTable('order_product');
  }
}
