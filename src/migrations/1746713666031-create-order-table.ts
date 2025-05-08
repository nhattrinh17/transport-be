import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrderTable1746713666031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng "order"
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isNullable: false,
            comment: 'Mã đơn hàng',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
            comment: 'Loại đơn vị vận chuyển',
          },
          {
            name: 'sorting',
            type: 'varchar',
            isNullable: true,
            comment: 'Mã Phân loại',
          },
          {
            name: 'shortcode',
            type: 'varchar',
            isNullable: true,
            comment: 'Mã ngắn dùng trong mã vạch',
          },
          {
            name: 'soc',
            type: 'varchar',
            isNullable: true,
            comment: 'Mã đơn hàng người gửi',
          },
          {
            name: 'note',
            type: 'varchar',
            comment: 'Yêu cầu đi kèm',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
            comment: 'Địa chỉ người nhận',
          },
          {
            name: 'phoneReceiver',
            type: 'varchar',
            comment: 'Số điện thoại người nhận',
          },
          {
            name: 'isPODEnabled',
            type: 'bool',
            default: false,
            comment: 'Yêu cầu bằng chứng giao',
          },
          {
            name: 'shareLink',
            type: 'varchar',
            isNullable: true,
            comment: 'Link chia sẻ đơn hàng',
          },
          {
            name: 'collection',
            type: 'int',
            comment: 'Số tiền thu hộ',
          },
          {
            name: 'value',
            type: 'int',
            default: 0,
            comment: 'Giá trị đơn',
          },
          {
            name: 'status',
            type: 'varchar',
            comment: 'Trạng thái đơn hàng',
          },
          {
            name: 'estimatedDeliveryTime',
            type: 'datetime',
            isNullable: true,
            comment: 'Thời gian giao hàng dự kiến',
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
        uniques: [
          {
            name: 'UQ_order_code_type',
            columnNames: ['code', 'type'],
          },
        ],
      }),
    );

    // Tạo bảng "order_detail"
    await queryRunner.createTable(
      new Table({
        name: 'order_detail',
        columns: [
          {
            name: 'id',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'orderId',
            type: 'varchar(36)',
          },
          {
            name: 'weight',
            type: 'int',
            default: 0,
            comment: 'Khối lượng đơn hàng',
          },
          {
            name: 'mainFee',
            type: 'int',
            default: 0,
            comment: 'Cước phí cơ bản',
          },
          {
            name: 'otherFee',
            type: 'int',
            default: 0,
            comment: 'Phí khác (đóng gói, phát sinh)',
          },
          {
            name: 'surcharge',
            type: 'int',
            default: 0,
            comment: 'Phí phụ (xăng dầu, huyện...)',
          },
          {
            name: 'collectionFee',
            type: 'int',
            default: 0,
            comment: 'Phí thu hộ',
          },
          {
            name: 'vat',
            type: 'int',
            default: 0,
            comment: 'Phí VAT',
          },
          {
            name: 'r2sFee',
            type: 'int',
            default: 0,
            comment: 'Phí giao lại',
          },
          {
            name: 'returnFee',
            type: 'int',
            default: 0,
            comment: 'Phí hoàn',
          },
          {
            name: 'totalFee',
            type: 'int',
            comment: 'Tổng phí đơn hàng',
          },
        ],
      }),
    );

    // Thêm foreign key từ order_detail -> order
    await queryRunner.createForeignKey(
      'order_detail',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Tạo index riêng cho code và type
    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_order_code',
        columnNames: ['code'],
      }),
    );

    await queryRunner.createIndex(
      'order',
      new TableIndex({
        name: 'IDX_order_type',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_detail');
    const foreignKey = table!.foreignKeys.find((fk) => fk.columnNames.indexOf('orderId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('order_detail', foreignKey);
    }

    await queryRunner.dropTable('order_detail');
    await queryRunner.dropIndex('order', 'IDX_order_code');
    await queryRunner.dropIndex('order', 'IDX_order_type');
    await queryRunner.dropTable('order');
  }
}
