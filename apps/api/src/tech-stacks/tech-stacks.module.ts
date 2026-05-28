import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TechStacksController } from "./tech-stacks.controller";
import { TechStacksService } from "./tech-stacks.service";

@Module({
  imports: [AuthModule],
  controllers: [TechStacksController],
  providers: [TechStacksService],
})
export class TechStacksModule {}
