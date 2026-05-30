import type { ApiSiteTechStackItem, SiteTechStackPayload } from "@/lib/api";
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

const SITE_STACK_SELECT = `
  *,
  tech_stacks(*)
`;

export async function listVisibleSiteTechStackItemsFromSupabase() {
  const supabase = await getReadClient();
  const { data, error } = await supabase
    .from("site_tech_stack_items")
    .select(SITE_STACK_SELECT)
    .eq("is_visible", true)
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSiteTechStackRow);
}

export async function listSiteTechStackItemsFromSupabase() {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("site_tech_stack_items")
    .select(SITE_STACK_SELECT)
    .order("group_name", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSiteTechStackRow);
}

export async function createSiteTechStackItemInSupabase(payload: SiteTechStackPayload) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("site_tech_stack_items")
    .insert(siteTechStackPayloadToRow(payload))
    .select(SITE_STACK_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapSiteTechStackRow(data);
}

export async function updateSiteTechStackItemInSupabase(id: string, payload: Partial<SiteTechStackPayload>) {
  const supabase = await getServerClient();
  const { data, error } = await supabase
    .from("site_tech_stack_items")
    .update(siteTechStackPayloadToRow(payload))
    .eq("id", id)
    .select(SITE_STACK_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapSiteTechStackRow(data);
}

export async function deleteSiteTechStackItemInSupabase(id: string) {
  const supabase = await getServerClient();
  const { data, error, count } = await supabase.from("site_tech_stack_items").delete({ count: "exact" }).eq("id", id).select("id");
  if (error) throw new Error(error.message);

  const deletedCount = count ?? data?.length ?? 0;
  if (deletedCount !== 1) {
    throw new Error("Tech stack item was not deleted. It may not exist, or your account does not have permission.");
  }

  return { id: data?.[0]?.id ?? id, deleted: true };
}

function siteTechStackPayloadToRow(payload: Partial<SiteTechStackPayload>) {
  const row: Record<string, unknown> = {};
  if (payload.techStackId !== undefined) row.tech_stack_id = payload.techStackId || null;
  if (payload.name !== undefined) row.name = payload.name;
  if (payload.groupName !== undefined) row.group_name = payload.groupName;
  if (payload.category !== undefined) row.category = payload.category;
  if (payload.sortOrder !== undefined) row.sort_order = payload.sortOrder;
  if (payload.isVisible !== undefined) row.is_visible = payload.isVisible;
  return row;
}

function mapSiteTechStackRow(row: any): ApiSiteTechStackItem {
  return {
    id: row.id,
    techStackId: row.tech_stack_id,
    techStack: row.tech_stacks ? {
      id: row.tech_stacks.id,
      name: row.tech_stacks.name,
      slug: row.tech_stacks.slug,
      category: row.tech_stacks.category,
      iconUrl: row.tech_stacks.icon_url,
      websiteUrl: row.tech_stacks.website_url,
      description: row.tech_stacks.description,
    } : null,
    name: row.name,
    groupName: row.group_name,
    category: row.category,
    sortOrder: row.sort_order ?? 0,
    isVisible: row.is_visible ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
