import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class GenerateDescriptionDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsString()
  tone?: string;
}
