import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RewriteDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @MinLength(5)
  text!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  instruction?: string;

  @IsOptional()
  @IsString()
  tone?: string;
}
