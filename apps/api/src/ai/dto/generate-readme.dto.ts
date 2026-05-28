import { IsArray, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class GenerateReadmeDto {
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
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsUrl({ require_tld: false })
  repositoryUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  liveUrl?: string;
}
