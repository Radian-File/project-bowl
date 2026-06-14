import { GithubSectionClient } from "@/components/sections/github-section-client";
import { getLatestRepos } from "@/lib/server/github-profile";

export async function GithubSection() {
  const repos = await getLatestRepos(3);
  return <GithubSectionClient repos={repos} />;
}
