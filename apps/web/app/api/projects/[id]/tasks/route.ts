import type { ApiTask } from "@/lib/api";
import { createProjectTaskInSupabase, listProjectTasksFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    return jsonOk(await listProjectTasksFromSupabase(id));
  } catch (error) {
    return jsonError(error, 503);
  }
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const payload = await readJson<Partial<ApiTask> & { title: string }>(request);
    return jsonOk(await createProjectTaskInSupabase(id, payload), { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
