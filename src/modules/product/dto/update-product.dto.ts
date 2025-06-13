import { IsStringOrNumber } from '@common/pipes';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên sp' })
  name: string;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'quantity', type: Number, description: 'Số lượng sp' })
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'status', type: String, description: 'Trạng thái sp' })
  status?: string;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'price', type: Number, description: 'Giá sp' })
  price: number;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: number;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: number;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: number;

  @IsOptional()
  @IsStringOrNumber()
  @ApiProperty({ name: 'weight', type: Number, description: 'Trọng lượng sp' })
  weight: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ name: 'tags', type: [String], description: 'Danh sách thẻ của sản phẩm' })
  tags: string[];
}
