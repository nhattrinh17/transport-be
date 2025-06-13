import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên sp' })
  name: string;

  @IsString()
  @ApiProperty({ name: 'warehouseId', type: String, description: 'Tên sp' })
  warehouseId?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'quantity', type: Number, description: 'Số lượng sp' })
  quantity: number;

  @IsString()
  @ApiProperty({ name: 'status', type: String, description: 'Trạng thái sp' })
  status?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'price', type: Number, description: 'Giá sp' })
  price: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ name: 'weight', type: Number, description: 'Trọng lượng sp' })
  weight: number;

  @IsArray()
  @ApiProperty({ name: 'tags', type: [String], description: 'Danh sách thẻ của sản phẩm' })
  tags: string[];
}
