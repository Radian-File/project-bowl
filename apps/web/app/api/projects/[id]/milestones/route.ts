import { listProjectMilestonesFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk } from "@/lib/server/route-response";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    return jsonOk(await listProjectMilestonesFromSupabase(id));
  } catch (error) {
    return jsonError(error, 503);
  }
}
