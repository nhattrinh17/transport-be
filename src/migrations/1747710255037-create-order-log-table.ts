import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateOrderLogTable1747710255037 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_log',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'orderId',
            type: 'varchar(36)',
            isNullable: false,
            comment: 'Mã đơn hàng',
          },
          {
            name: 'typeUpdate',
            type: 'varchar',
            isNullable: false,
            comment: 'Loại cập nhật trạng thái đơn hàng',
          },
          {
            name: 'statusPrevious',
            type: 'varchar',
            isNullable: false,
            comment: 'Trạng thái cũ đơn hàng',
          },
          {
            name: 'statusCurrent',
            type: 'varchar',
            isNullable: false,
            comment: 'Trạng thái mới đơn hàng',
          },
          {
            name: 'changeBy',
            type: 'varchar',
            isNullable: false,
            comment: 'Người cập nhật',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_log',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_log');
    const foreignKey = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('orderId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('order_detail', foreignKey);
    }

    await queryRunner.dropTable('order_log');
  }
}
