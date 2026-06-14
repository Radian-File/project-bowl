import { getLatestRepos } from "@/lib/server/github-profile";
import { jsonError, jsonOk } from "@/lib/server/route-response";

export const revalidate = 1800;

export async function GET() {
  try {
    return jsonOk(await getLatestRepos(3));
  } catch (error) {
    return jsonError(error, 503);
  }
}
