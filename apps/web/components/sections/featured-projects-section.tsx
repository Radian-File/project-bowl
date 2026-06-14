import { FeaturedProjectsClient } from "@/components/sections/featured-projects-client";
import { listPublicProjectsFromSupabase } from "@/lib/data/projects";
import { featuredProjectSlugs } from "@/lib/portfolio-data";
import { normalizeApiProject } from "@/lib/project-view";

async function getDisplayProjects() {
  try {
    const apiProjects = await listPublicProjectsFromSupabase();
    const normalized = apiProjects.map(normalizeApiProject);

    // Show exactly the curated top-4 in the order defined by featuredProjectSlugs.
    const ordered = featuredProjectSlugs
      .map((slug) => normalized.find((project) => project.slug === slug))
      .filter((project): project is (typeof normalized)[number] => Boolean(project));

    // Fall back to all public projects if none of the curated slugs matched
    // (e.g. slugs changed in the DB) so the section never goes empty.
    return { projects: ordered.length > 0 ? ordered : normalized, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Portfolio API unavailable.";
    return { projects: [], error: message };
  }
}

export async function FeaturedProjectsSection() {
  const result = await getDisplayProjects();
  return <FeaturedProjectsClient projects={result.projects} error={result.error} />;
}
