import { IsOptional, IsString, MinLength } from "class-validator";

export class TranslateDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @MinLength(2)
  text!: string;

  @IsString()
  targetLanguage!: string;

  @IsOptional()
  @IsString()
  sourceLanguage?: string;
}
