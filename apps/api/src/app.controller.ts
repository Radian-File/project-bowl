import { Controller, Get } from "@nestjs/common";
import type { ApiHealthResponse } from "@projectbowl/types";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  getHealth(): ApiHealthResponse {
    return this.appService.getHealth();
  }
}
