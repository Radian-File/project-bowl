import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));

describe("web app smoke", () => {
  it("keeps the App Router home page in place", () => {
    const pagePath = join(appRoot, "app", "page.tsx");
    assert.equal(existsSync(pagePath), true);

    const page = readFileSync(pagePath, "utf8");
    assert.match(page, /export default function/);
  });

  it("has API client configuration for runtime API URL", () => {
    const apiClientPath = join(appRoot, "lib", "api.ts");
    const apiClient = readFileSync(apiClientPath, "utf8");

    assert.match(apiClient, /NEXT_PUBLIC_API_URL/);
  });
});
