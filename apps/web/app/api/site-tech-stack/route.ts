import type { SiteTechStackPayload } from "@/lib/api";
import { createSiteTechStackItemInSupabase, listSiteTechStackItemsFromSupabase } from "@/lib/data/site-tech-stack";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return jsonOk(await listSiteTechStackItemsFromSupabase());
  } catch (error) {
    return jsonError(error, 503);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await readJson<SiteTechStackPayload>(request);
    return jsonOk(await createSiteTechStackItemInSupabase(payload), { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
