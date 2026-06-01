import { FeaturedProjectsClient } from "@/components/sections/featured-projects-client";
import { listPublicProjectsFromSupabase } from "@/lib/data/projects";
import { normalizeApiProject } from "@/lib/project-view";

async function getDisplayProjects() {
  try {
    const apiProjects = await listPublicProjectsFromSupabase();
    return { projects: apiProjects.map(normalizeApiProject), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portfolio API unavailable.";
    return { projects: [], error: message };
  }
}

export async function FeaturedProjectsSection() {
  const result = await getDisplayProjects();
  return <FeaturedProjectsClient projects={result.projects} error={result.error} />;
}
