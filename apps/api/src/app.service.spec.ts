import { AppService } from "./app.service";

describe("AppService", () => {
  it("returns API health metadata", () => {
    const service = new AppService();

    expect(service.getHealth()).toEqual({
      status: "ok",
      service: "projectbowl-api",
      timestamp: expect.any(String),
    });
    expect(new Date(service.getHealth().timestamp).toString()).not.toBe("Invalid Date");
  });
});
