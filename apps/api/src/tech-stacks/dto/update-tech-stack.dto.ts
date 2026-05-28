import { IsEnum, IsOptional, IsString, IsUrl, Matches, MaxLength } from "class-validator";
import { TechStackCategory } from "../../common/enums/domain.enums";

export class UpdateTechStackDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsOptional()
  @IsEnum(TechStackCategory)
  category?: TechStackCategory;

  @IsOptional()
  @IsUrl({ require_tld: false })
  iconUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
