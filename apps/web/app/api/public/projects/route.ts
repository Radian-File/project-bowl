import { listPublicProjectsFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk } from "@/lib/server/route-response";

export async function GET() {
  try {
    return jsonOk(await listPublicProjectsFromSupabase());
  } catch (error) {
    return jsonError(error, 503);
  }
}
