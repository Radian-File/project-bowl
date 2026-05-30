import type { SiteTechStackPayload } from "@/lib/api";
import { deleteSiteTechStackItemInSupabase, updateSiteTechStackItemInSupabase } from "@/lib/data/site-tech-stack";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

type Context = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const payload = await readJson<Partial<SiteTechStackPayload>>(request);
    return jsonOk(await updateSiteTechStackItemInSupabase(id, payload));
  } catch (error) {
    return jsonError(error, 400);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    return jsonOk(await deleteSiteTechStackItemInSupabase(id));
  } catch (error) {
    return jsonError(error, 400);
  }
}
