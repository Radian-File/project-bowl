import type { ApiTechStack } from "@/lib/api";
import { createTechStackInSupabase, listTechStacksFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return jsonOk(await listTechStacksFromSupabase());
  } catch (error) {
    return jsonError(error, 503);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await readJson<Partial<ApiTechStack> & { name: string }>(request);
    return jsonOk(await createTechStackInSupabase(payload), { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
