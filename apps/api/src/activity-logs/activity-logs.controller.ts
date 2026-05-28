import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user";
import { UserRole } from "../common/enums/domain.enums";
import { ActivityLogsService } from "./activity-logs.service";
import { ActivityLogQueryDto } from "./dto/activity-log-query.dto";
import { CreateActivityLogDto } from "./dto/create-activity-log.dto";

@ApiTags("Activity Logs")
@ApiBearerAuth()
@Controller("activity-logs")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(@Query() query: ActivityLogQueryDto) {
    return this.activityLogsService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateActivityLogDto, @CurrentUser() user: AuthenticatedUser) {
    return this.activityLogsService.create(dto, user.userId);
  }
}
