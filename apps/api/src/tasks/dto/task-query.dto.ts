import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../common/enums/domain.enums";

export class TaskQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
