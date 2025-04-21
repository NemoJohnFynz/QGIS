import { IsString, IsNotEmpty, IsNumber, Min, Max, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '654e87f23e5b2d7b44f137dd' })
  @IsMongoId()
  location: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Thức ăn ngon và phục vụ tốt', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
