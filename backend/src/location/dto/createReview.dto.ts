import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '605c5f2b0e3b2c5f88e6a9d4', description: 'ID người dùng' })
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @ApiProperty({ example: '605c5f2b0e3b2c5f88e6a9d5', description: 'ID địa điểm' })
  @IsNotEmpty()
  @IsMongoId()
  location: string;

  @ApiProperty({ example: 4, description: 'Số sao đánh giá từ 1 đến 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Không gian thoải mái, nước ngon', required: false })
  @IsOptional()
  comment?: string;
}
