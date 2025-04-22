import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateIf, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class SendMessageDto {
  @ApiProperty({
    example: "your content",
    required: false,
    type: "string",
    description: "Phải cung cấp ít nhất một trong các trường content, location, hoặc file (mediaURL).",
  })
  @ValidateIf((o) => !o.location)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly content?: string;

  @ApiProperty({
    example: "your location",
    required: false,
    type: "string",
    description: "Phải cung cấp ít nhất một trong các trường content, location, hoặc file (mediaURL).",
  })
  @ValidateIf((o) => !o.content)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly location?: string;
}