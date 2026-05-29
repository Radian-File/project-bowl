import type { ProjectPayload } from "@/lib/api";
import { createProjectInSupabase, listProjectsFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

export async function GET() {
  try {
    return jsonOk(await listProjectsFromSupabase());
  } catch (error) {
    return jsonError(error, 503);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await readJson<ProjectPayload>(request);
    return jsonOk(await createProjectInSupabase(payload), { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
