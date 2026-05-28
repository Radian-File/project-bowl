import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { validateEnvironment } from "./common/config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { ProjectsModule } from "./projects/projects.module";
import { TechStacksModule } from "./tech-stacks/tech-stacks.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env"],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    ProjectsModule,
    TechStacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
