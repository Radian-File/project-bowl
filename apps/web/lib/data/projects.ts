import type {
  ApiActivityLog,
  ApiImage,
  ApiMilestone,
  ApiProject,
  ApiTask,
  ApiTechStack,
  ProjectPayload,
} from "@/lib/api";
import { createSupabaseAdminClient, createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

function ensureConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

async function getReadClient() {
  ensureConfigured();
  try {
    return createSupabaseAdminClient();
  } catch {
    return createSupabaseServerClient();
  }
}

async function getServerClient() {
  ensureConfigured();
  return createSupabaseServerClient();
}

export async function listPublicProjectsFromSupabase() {
  const supabase = await getReadClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("visibility", "PUBLIC")
    .not("published_at", "is", null)
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProjectRow);
}

export async function getPublicProjectFromSupabase(slug: string) {
  const supabase = await getReadClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("visibility", "PUBLIC")
    .single();

  if (error) throw new Error(error.message);
  return mapProjectRow(data);
}

export async function listProjectsFromSupabase() {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProjectRow);
}

export async function getProjectByIdFromSupabase(id: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("projects").select(PROJECT_SELECT).eq("id", id).single();
  if (error) throw new Error(error.message);
  return mapProjectRow(data);
}

export async function createProjectInSupabase(payload: ProjectPayload) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const insertPayload = projectPayloadToRow(payload, user?.id);
  const { data, error } = await supabase.from("projects").insert(insertPayload).select("id").single();
  if (error) throw new Error(error.message);

  await syncProjectRelations(data.id, payload);
  await logActivity(data.id, "create", "project", data.id, `Created project ${payload.title}`);
  return getProjectByIdFromSupabase(data.id);
}

export async function updateProjectInSupabase(id: string, payload: Partial<ProjectPayload>) {
  const supabase = await getServerClient();
  const { error } = await supabase.from("projects").update(projectPayloadToRow(payload)).eq("id", id);
  if (error) throw new Error(error.message);

  await syncProjectRelations(id, payload);
  await logActivity(id, "update", "project", id, "Updated project metadata");
  return getProjectByIdFromSupabase(id);
}

export async function deleteProjectInSupabase(id: string) {
  const supabase = await getServerClient();
  const { data, error, count } = await supabase.from("projects").delete({ count: "exact" }).eq("id", id).select("id");
  if (error) throw new Error(error.message);

  const deletedCount = count ?? data?.length ?? 0;
  if (deletedCount !== 1) {
    throw new Error("Project was not deleted. It may not exist, or your account does not have permission to delete it.");
  }

  return { id: data?.[0]?.id ?? id, deleted: true };
}

export async function listTechStacksFromSupabase() {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("tech_stacks").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTechStackRow);
}

export async function createTechStackInSupabase(payload: Partial<ApiTechStack> & { name: string }) {
  const supabase = await getServerClient();
  const row = {
    name: payload.name,
    slug: payload.slug ?? slugify(payload.name),
    category: payload.category ?? "OTHER",
    icon_url: payload.iconUrl ?? null,
    website_url: payload.websiteUrl ?? null,
    description: payload.description ?? null,
  };
  const { data, error } = await supabase.from("tech_stacks").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return mapTechStackRow(data);
}

export async function listProjectTasksFromSupabase(projectId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("tasks").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTaskRow);
}

export async function createProjectTaskInSupabase(projectId: string, payload: Partial<ApiTask> & { title: string }) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const row = {
    project_id: projectId,
    title: payload.title,
    description: payload.description ?? null,
    status: payload.status ?? "TODO",
    priority: typeof payload.priority === "number" ? payload.priority : 0,
    due_date: payload.dueDate ?? null,
    created_by_id: user?.id ?? null,
  };
  const { data, error } = await supabase.from("tasks").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  await logActivity(projectId, "create", "task", data.id, `Created task ${payload.title}`);
  return mapTaskRow(data);
}

export async function listProjectMilestonesFromSupabase(projectId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("project_milestones").select("*").eq("project_id", projectId).order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMilestoneRow);
}

export async function listProjectActivityFromSupabase(projectId: string) {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("activity_logs").select("*").eq("project_id", projectId).order("created_at", { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapActivityRow);
}

export async function listActivityFromSupabase() {
  const supabase = await getServerClient();
  const { data, error } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapActivityRow);
}

async function syncProjectRelations(projectId: string, payload: Partial<ProjectPayload>) {
  const supabase = await getServerClient();

  if (payload.techStackIds) {
    await supabase.from("project_tech_stacks").delete().eq("project_id", projectId);
    if (payload.techStackIds.length > 0) {
      const rows = payload.techStackIds.map((techStackId, index) => ({ project_id: projectId, tech_stack_id: techStackId, sort_order: index }));
      const { error } = await supabase.from("project_tech_stacks").insert(rows);
      if (error) throw new Error(error.message);
    }
  }

  if (payload.images) {
    await supabase.from("project_images").delete().eq("project_id", projectId).eq("type", "COVER");
    const rows = payload.images.filter((image) => image.url).map((image, index) => ({
      project_id: projectId,
      type: image.type ?? "GALLERY",
      url: image.url,
      alt_text: image.altText ?? null,
      width: image.width ?? null,
      height: image.height ?? null,
      sort_order: image.sortOrder ?? index,
    }));
    if (rows.length > 0) {
      const { error } = await supabase.from("project_images").insert(rows);
      if (error) throw new Error(error.message);
    }
  }
}

async function logActivity(projectId: string | null, action: string, entityType: string, entityId: string | null, message: string) {
  try {
    const supabase = await getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("activity_logs").insert({
      project_id: projectId,
      user_id: user?.id ?? null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      message,
    });
  } catch {
    // Activity logging should never block primary mutations.
  }
}

const PROJECT_SELECT = `
  *,
  project_images(*),
  project_tech_stacks(sort_order, tech_stacks(*))
`;

function mapProjectRow(row: any): ApiProject {
  const techStacks = (row.project_tech_stacks ?? [])
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((link: any) => ({
      techStackId: link.tech_stacks?.id,
      sortOrder: link.sort_order ?? 0,
      techStack: link.tech_stacks ? mapTechStackRow(link.tech_stacks) : undefined,
    }));

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    problem: row.problem,
    solution: row.solution,
    status: row.status,
    visibility: row.visibility,
    isFeatured: row.is_featured,
    repositoryUrl: row.repository_url,
    liveUrl: row.live_url,
    caseStudyUrl: row.case_study_url,
    publishedAt: row.published_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    ownerId: row.owner_id,
    techStacks,
    images: (row.project_images ?? []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(mapImageRow),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTechStackRow(row: any): ApiTechStack {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    iconUrl: row.icon_url,
    websiteUrl: row.website_url,
    description: row.description,
  };
}

function mapImageRow(row: any): ApiImage {
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    altText: row.alt_text,
    width: row.width,
    height: row.height,
    sortOrder: row.sort_order,
  };
}

function mapTaskRow(row: any): ApiTask {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMilestoneRow(row: any): ApiMilestone {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    progress: row.progress ?? 0,
    dueDate: row.target_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapActivityRow(row: any): ApiActivityLog {
  return {
    id: row.id,
    projectId: row.project_id,
    type: row.entity_type,
    action: row.action,
    message: row.message,
    createdAt: row.created_at,
  };
}

function projectPayloadToRow(payload: Partial<ProjectPayload>, ownerId?: string) {
  const row: Record<string, unknown> = {};
  if (payload.title !== undefined) row.title = payload.title;
  if (payload.slug !== undefined || payload.title !== undefined) row.slug = payload.slug || slugify(payload.title ?? "project");
  if (payload.summary !== undefined) row.summary = payload.summary;
  if (payload.description !== undefined) row.description = payload.description || null;
  if (payload.problem !== undefined) row.problem = payload.problem || null;
  if (payload.solution !== undefined) row.solution = payload.solution || null;
  if (payload.status !== undefined) row.status = payload.status;
  if (payload.visibility !== undefined) {
    row.visibility = payload.visibility;
    row.published_at = payload.visibility === "PUBLIC" ? new Date().toISOString() : null;
  }
  if (payload.isFeatured !== undefined) row.is_featured = payload.isFeatured;
  if (payload.repositoryUrl !== undefined) row.repository_url = payload.repositoryUrl || null;
  if (payload.liveUrl !== undefined) row.live_url = payload.liveUrl || null;
  if (payload.caseStudyUrl !== undefined) row.case_study_url = payload.caseStudyUrl || null;
  if (payload.startedAt !== undefined) row.started_at = payload.startedAt || null;
  if (payload.completedAt !== undefined) row.completed_at = payload.completedAt || null;
  if (ownerId) row.owner_id = ownerId;
  return row;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
