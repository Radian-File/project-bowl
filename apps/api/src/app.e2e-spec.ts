import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController (API smoke)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health", async () => {
    await request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: "ok",
          service: "projectbowl-api",
        });
        expect(typeof body.timestamp).toBe("string");
      });
  });
});
