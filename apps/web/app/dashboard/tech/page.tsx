"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, EyeOff, Layers3, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { Badge, Card, Input, SectionLabel, buttonClasses } from "@projectbowl/ui";
import {
  ApiSiteTechStackItem,
  ApiTechStack,
  SiteTechStackPayload,
  TechStackCategory,
  createSiteTechStackItem,
  createTechStack,
  deleteSiteTechStackItem,
  listSiteTechStackItems,
  listTechStacks,
  updateSiteTechStackItem,
} from "@/lib/api";
import {
  buildStackOptions,
  findMatchingTechStack,
  isStackOptionSelected,
  normalizeTechKey,
  siteStackGroups,
  techStackCategories,
  type SiteStackGroupName,
} from "@/lib/tech-stack-presets";

export default function DashboardTechPage() {
  const [items, setItems] = useState<ApiSiteTechStackItem[]>([]);
  const [techStacks, setTechStacks] = useState<ApiTechStack[]>([]);
  const [groupName, setGroupName] = useState<SiteStackGroupName>("Frontend");
  const [category, setCategory] = useState<TechStackCategory | "ALL">("FRONTEND");
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");
  const [customGroupName, setCustomGroupName] = useState<SiteStackGroupName>("Frontend");
  const [customCategory, setCustomCategory] = useState<TechStackCategory>("FRONTEND");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([listSiteTechStackItems(), listTechStacks()])
      .then(([siteResult, stackResult]) => {
        if (!active) return;
        if (siteResult.status === "fulfilled") setItems(siteResult.value);
        else setError(siteResult.reason instanceof Error ? siteResult.reason.message : "Could not load homepage tech stack.");

        if (stackResult.status === "fulfilled") setTechStacks(stackResult.value);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stackOptions = useMemo(() => buildStackOptions(techStacks, category, search), [category, search, techStacks]);
  const groupedItems = useMemo(() => groupSiteStackItems(items), [items]);

  async function ensureMasterStack(name: string, stackCategory: TechStackCategory, existingId?: string) {
    if (existingId) {
      const stack = techStacks.find((item) => item.id === existingId);
      if (stack) return stack;
    }

    const existing = findMatchingTechStack(techStacks, name);
    if (existing) return existing;

    const created = await createTechStack({ name, category: stackCategory });
    setTechStacks((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }

  async function addSiteStack(payload: SiteTechStackPayload) {
    const duplicate = items.some((item) => item.groupName === payload.groupName && normalizeTechKey(item.name) === normalizeTechKey(payload.name));
    if (duplicate) {
      setMessage(`${payload.name} sudah ada di group ${payload.groupName}.`);
      return;
    }

    const sortOrder = items.filter((item) => item.groupName === payload.groupName).length;
    const created = await createSiteTechStackItem({ ...payload, sortOrder, isVisible: true });
    setItems((current) => [...current, created].sort(compareSiteStackItems));
    setMessage(`${created.name} ditambahkan ke ${created.groupName}.`);
  }

  async function handleSelectPreset(optionKey: string) {
    const option = stackOptions.find((item) => item.key === optionKey);
    if (!option) return;

    setIsMutating(true);
    setError(null);
    setMessage(null);
    try {
      const stack = await ensureMasterStack(option.name, option.category, option.id);
      await addSiteStack({
        techStackId: stack.id,
        name: stack.name,
        groupName,
        category: (stack.category as TechStackCategory | undefined) ?? option.category,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add stack to homepage.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleCreateCustom() {
    if (!customName.trim()) {
      setError("Isi nama tech stack custom dulu.");
      return;
    }

    setIsMutating(true);
    setError(null);
    setMessage(null);
    try {
      const stack = await ensureMasterStack(customName.trim(), customCategory);
      await addSiteStack({
        techStackId: stack.id,
        name: stack.name,
        groupName: customGroupName,
        category: (stack.category as TechStackCategory | undefined) ?? customCategory,
      });
      setCustomName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create custom stack.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleToggleVisible(item: ApiSiteTechStackItem) {
    setIsMutating(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await updateSiteTechStackItem(item.id, { isVisible: !item.isVisible, name: item.name, groupName: item.groupName });
      setItems((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update stack visibility.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete(item: ApiSiteTechStackItem) {
    const confirmed = window.confirm(`Remove ${item.name} from ${item.groupName}?`);
    if (!confirmed) return;

    setIsMutating(true);
    setError(null);
    setMessage(null);
    try {
      await deleteSiteTechStackItem(item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage(`${item.name} dihapus dari ${item.groupName}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete stack.");
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel>Homepage Stack</SectionLabel>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Manage public tech stack.</h2>
          <p className="mt-3 max-w-2xl text-slate-400">Pilih tools yang mau tampil di section portfolio <span className="text-cyan-200">/#stack</span>. Stack bisa dipilih dari preset besar atau dibuat custom.</p>
        </div>
        <Badge tone="purple">{items.filter((item) => item.isVisible).length} visible</Badge>
      </div>

      {isLoading ? <Card className="flex items-center gap-3 p-6 text-slate-300"><Loader2 className="h-5 w-5 animate-spin text-cyan-200" /> Loading tech stack manager...</Card> : null}
      {error ? <div className="flex gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> <span>{error}</span></div> : null}
      {message ? <div className="rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm text-lime-100">{message}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {siteStackGroups.map((group) => {
            const groupItems = groupedItems.get(group) ?? [];
            return (
              <Card key={group} className="p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">{group}</h3>
                    <p className="text-sm text-slate-500">{groupItems.length} item</p>
                  </div>
                  <Layers3 className="h-5 w-5 text-cyan-200" />
                </div>
                {groupItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-slate-500">Belum ada stack di group ini.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {groupItems.map((item, index) => (
                      <span key={item.id} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${item.isVisible ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-500"}`}>
                        <span>{item.name}</span>
                        <Badge tone={index % 2 === 0 ? "purple" : "cyan"}>{item.category}</Badge>
                        <button type="button" onClick={() => handleToggleVisible(item)} disabled={isMutating} title={item.isVisible ? "Hide" : "Show"} className="text-slate-300 transition hover:text-white">
                          {item.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} disabled={isMutating} title="Remove" className="text-rose-200 transition hover:text-rose-100">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <Search className="h-5 w-5 text-cyan-200" />
              <div>
                <h3 className="font-display text-2xl font-semibold text-white">Add from preset</h3>
                <p className="text-sm text-slate-500">Cari stack dari list preset. Kalau belum ada di database, akan dibuat otomatis.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Target group</span>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={groupName} onChange={(event) => setGroupName(event.target.value as SiteStackGroupName)}>
                  {siteStackGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Category filter</span>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={category} onChange={(event) => setCategory(event.target.value as TechStackCategory | "ALL")}>
                  <option value="ALL">ALL</option>
                  {techStackCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="TypeScript, Vue, Supabase..." />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Stack</span>
                <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value="" onChange={(event) => handleSelectPreset(event.target.value)} disabled={isMutating || isLoading}>
                  <option value="">{isMutating ? "Adding stack..." : "Choose a stack"}</option>
                  {stackOptions.map((option) => {
                    const selected = isStackOptionSelected(option, items.map((item) => item.techStackId ?? "").filter(Boolean), techStacks) && items.some((item) => item.groupName === groupName && normalizeTechKey(item.name) === normalizeTechKey(option.name));
                    return <option key={option.key} value={option.key} disabled={selected}>{option.name}{selected ? " ✓" : option.id ? "" : " · preset"}</option>;
                  })}
                </select>
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-2xl font-semibold text-white">Create custom stack</h3>
            <p className="mt-1 text-sm text-slate-500">Kalau opsi tidak ada di preset, buat manual di sini.</p>
            <div className="mt-5 grid gap-3">
              <Input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Example: Payload CMS" />
              <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={customGroupName} onChange={(event) => setCustomGroupName(event.target.value as SiteStackGroupName)}>
                {siteStackGroups.map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
              <select className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none" value={customCategory} onChange={(event) => setCustomCategory(event.target.value as TechStackCategory)}>
                {techStackCategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button type="button" className={buttonClasses({ variant: "secondary" })} onClick={handleCreateCustom} disabled={isMutating}>
                {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add custom stack
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function groupSiteStackItems(items: ApiSiteTechStackItem[]) {
  const groups = new Map<string, ApiSiteTechStackItem[]>();
  for (const group of siteStackGroups) groups.set(group, []);

  for (const item of [...items].sort(compareSiteStackItems)) {
    groups.set(item.groupName, [...(groups.get(item.groupName) ?? []), item]);
  }

  return groups;
}

function compareSiteStackItems(a: ApiSiteTechStackItem, b: ApiSiteTechStackItem) {
  return a.groupName.localeCompare(b.groupName) || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}
