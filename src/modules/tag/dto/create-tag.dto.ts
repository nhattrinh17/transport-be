import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @ApiProperty({ name: 'name', type: String, description: 'Tên thẻ' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ name: 'description', type: String, description: 'Mô tả thẻ' })
  description?: string;
}
