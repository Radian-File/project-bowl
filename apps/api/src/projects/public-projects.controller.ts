import { Controller, Get, Param } from "@nestjs/common";
import { ProjectsService } from "./projects.service";

@Controller("public/projects")
export class PublicProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findPublished() {
    return this.projectsService.findPublished();
  }

  @Get(":slug")
  findPublishedBySlug(@Param("slug") slug: string) {
    return this.projectsService.findPublishedBySlug(slug);
  }
}
