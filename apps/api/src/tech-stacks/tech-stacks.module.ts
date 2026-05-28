import { Module } from "@nestjs/common";
import { TechStacksController } from "./tech-stacks.controller";
import { TechStacksService } from "./tech-stacks.service";

@Module({
  controllers: [TechStacksController],
  providers: [TechStacksService],
})
export class TechStacksModule {}
