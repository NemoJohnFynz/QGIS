import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'trường học', required: true })
  @IsString()
  @MaxLength(40, { message: 'tối đa 40 ký tự thôiz' })
  readonly name: string;

  @ApiProperty({ example: 'nơi đào tạo mầm non của đất nước', required: true })
  @IsString()
  @MaxLength(200, { message: 'tối đã 200 thôiz' })
  readonly description: string;

}
