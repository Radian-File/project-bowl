import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateTechStackDto } from "./dto/create-tech-stack.dto";
import { UpdateTechStackDto } from "./dto/update-tech-stack.dto";
import { TechStacksService } from "./tech-stacks.service";

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
  create(@Body() dto: CreateTechStackDto) {
    return this.techStacksService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTechStackDto) {
    return this.techStacksService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.techStacksService.remove(id);
  }
}
