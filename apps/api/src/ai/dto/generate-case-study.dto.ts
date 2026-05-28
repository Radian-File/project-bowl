import { IsArray, IsOptional, IsString, MaxLength } from "class-validator";

export class GenerateCaseStudyDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(500)
  summary!: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  outcome?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];
}
