import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên sp' })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'quantity', type: Number, description: 'Số lượng sp' })
  quantity: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'status', type: String, description: 'Trạng thái sp' })
  status?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'price', type: Number, description: 'Giá sp' })
  price: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'length', type: Number, description: 'Chiều dài sp' })
  length: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'width', type: Number, description: 'Chiều rộng sp' })
  width: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'height', type: Number, description: 'Chiều cao sp' })
  height: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ name: 'weight', type: Number, description: 'Trọng lượng sp' })
  weight: number;
}
