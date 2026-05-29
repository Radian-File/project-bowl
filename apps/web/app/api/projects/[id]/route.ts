import type { ProjectPayload } from "@/lib/api";
import { deleteProjectInSupabase, getProjectByIdFromSupabase, updateProjectInSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk, readJson } from "@/lib/server/route-response";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    return jsonOk(await getProjectByIdFromSupabase(id));
  } catch (error) {
    return jsonError(error, 404);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  try {
    const payload = await readJson<Partial<ProjectPayload>>(request);
    return jsonOk(await updateProjectInSupabase(id, payload));
  } catch (error) {
    return jsonError(error, 400);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  try {
    return jsonOk(await deleteProjectInSupabase(id));
  } catch (error) {
    return jsonError(error, 400);
  }
}
