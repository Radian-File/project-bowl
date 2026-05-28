import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user";
import { UserRole } from "../common/enums/domain.enums";
import { CreateTechStackDto } from "./dto/create-tech-stack.dto";
import { UpdateTechStackDto } from "./dto/update-tech-stack.dto";
import { TechStacksService } from "./tech-stacks.service";

@ApiTags("Tech Stacks")
@Controller("tech-stacks")
export class TechStacksController {
  constructor(private readonly techStacksService: TechStacksService) {}

  @Get()
  findAll() {
    return this.techStacksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.techStacksService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  create(@Body() dto: CreateTechStackDto, @CurrentUser() user: AuthenticatedUser) {
    return this.techStacksService.create(dto, user.userId);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  update(@Param("id") id: string, @Body() dto: UpdateTechStackDto, @CurrentUser() user: AuthenticatedUser) {
    return this.techStacksService.update(id, dto, user.userId);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.techStacksService.remove(id, user.userId);
  }
}
