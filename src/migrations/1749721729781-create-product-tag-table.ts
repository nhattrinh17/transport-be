import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductTagTable1749721729781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tag',
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
            name: 'description',
            type: 'varchar',
            isNullable: false,
            comment: 'Mô tả',
          },
          {
            name: 'slug',
            type: 'varchar(256)',
            isNullable: false,
            comment: 'Đường dẫn',
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

    await queryRunner.createTable(
      new Table({
        name: 'product_tag',
        columns: [
          {
            name: 'productId',
            type: 'varchar(36)',
            isPrimary: true,
          },
          {
            name: 'tagId',
            type: 'varchar(36)',
            isPrimary: true,
          },
        ],
      }),
    );

    // FK: productId → product(id)
    await queryRunner.createForeignKey(
      'product_tag',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // FK: tagId → tag(id)
    await queryRunner.createForeignKey(
      'product_tag',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedTableName: 'tag',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_tag');
    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('product_tag', fk);
      }
    }

    await queryRunner.dropTable('product_tag');
    await queryRunner.dropTable('tag');
  }
}
