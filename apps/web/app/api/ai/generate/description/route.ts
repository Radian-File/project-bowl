import { generateWithOpenRouter } from "@/lib/server/openrouter";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

export async function POST(request: Request) {
  try {
    const payload = await readJson<Record<string, unknown>>(request);
    return jsonOk(await generateWithOpenRouter("description", payload));
  } catch (error) {
    return jsonError(error, 503);
  }
}
