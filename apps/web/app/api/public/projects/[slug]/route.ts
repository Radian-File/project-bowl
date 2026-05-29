import { getPublicProjectFromSupabase } from "@/lib/data/projects";
import { jsonError, jsonOk } from "@/lib/server/route-response";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    return jsonOk(await getPublicProjectFromSupabase(slug));
  } catch (error) {
    return jsonError(error, 404);
  }
}
