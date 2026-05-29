import { listActivityFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk } from "@/lib/server/route-response";

export async function GET() {
  try {
    return jsonOk(await listActivityFromSupabase());
  } catch (error) {
    return jsonError(error, 503);
  }
}
