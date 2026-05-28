import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Min } from "class-validator";
import { ProjectImageType } from "../../common/enums/domain.enums";

export class ProjectImageDto {
  @IsOptional()
  @IsEnum(ProjectImageType)
  type?: ProjectImageType;

  @IsUrl({ require_tld: false })
  url!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
