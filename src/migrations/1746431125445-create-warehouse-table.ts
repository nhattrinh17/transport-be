import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWarehouseTable1746431125445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng warehouse
    await queryRunner.createTable(
      new Table({
        name: 'warehouse',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'province',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'district',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ward',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'personCharge',
            type: 'varchar',
            isNullable: true,
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

    // Tạo bảng warehouse_detail
    await queryRunner.createTable(
      new Table({
        name: 'warehouse_detail',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'warehouseId',
            type: 'varchar(36)',
          },
          {
            name: 'code',
            type: 'varchar',
            comment: 'Mã kho(Mã shop) sẽ là lưu chung cho tất cả các đơn vị',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'cusId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provinceId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'districtId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'wardId',
            type: 'varchar',
            isNullable: true,
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

    // Thêm khóa ngoại warehouse_detail.warehouseId -> warehouse.id
    await queryRunner.createForeignKey(
      'warehouse_detail',
      new TableForeignKey({
        columnNames: ['warehouseId'],
        referencedTableName: 'warehouse',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Lấy foreign key hiện tại của warehouse_detail
    const table = await queryRunner.getTable('warehouse_detail');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('warehouseId') !== -1);

    // Xóa foreign key nếu tồn tại
    if (foreignKey) {
      await queryRunner.dropForeignKey('warehouse_detail', foreignKey);
    }

    // Xóa bảng warehouse_detail trước (phụ thuộc)
    await queryRunner.dropTable('warehouse_detail');

    // Xóa bảng warehouse sau
    await queryRunner.dropTable('warehouse');
  }
}
