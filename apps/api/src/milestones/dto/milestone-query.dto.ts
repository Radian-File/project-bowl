import { IsEnum, IsOptional, IsString } from "class-validator";
import { MilestoneStatus } from "../../common/enums/domain.enums";

export class MilestoneQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(MilestoneStatus)
  status?: MilestoneStatus;
}
