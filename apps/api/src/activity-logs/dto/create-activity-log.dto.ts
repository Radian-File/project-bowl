import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateActivityLogDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  action!: string;

  @IsString()
  entityType!: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
