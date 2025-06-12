import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên sp' })
  name: string;

  @IsNumber()
  @ApiProperty({ name: 'quantity', type: Number, description: 'Số lượng sp' })
  quantity: number;

  @IsString()
  @ApiProperty({ name: 'status', type: String, description: 'Trạng thái sp' })
  status?: string;

  @IsNumber()
  @ApiProperty({ name: 'price', type: Number, description: 'Giá sp' })
  price: number;

  @IsNumber()
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: number;

  @IsNumber()
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: number;

  @IsNumber()
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: number;

  @IsNumber()
  @ApiProperty({ name: 'weight', type: Number, description: 'Trọng lượng sp' })
  weight: number;

  @IsArray()
  @ApiProperty({ name: 'tags', type: [String], description: 'Danh sách thẻ của sản phẩm' })
  tags: string[];
}
