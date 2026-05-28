import { Injectable } from "@nestjs/common";
import type { ApiHealthResponse } from "@projectbowl/types";

@Injectable()
export class AppService {
  getHealth(): ApiHealthResponse {
    return {
      status: "ok",
      service: "projectbowl-api",
      timestamp: new Date().toISOString(),
    };
  }
}
