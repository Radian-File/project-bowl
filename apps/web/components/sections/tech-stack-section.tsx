import { TechStackClient } from "@/components/sections/tech-stack-client";
import { listVisibleSiteTechStackItemsFromSupabase } from "@/lib/data/site-tech-stack";
import { stackGroups } from "@/lib/portfolio-data";
import { siteStackGroups } from "@/lib/tech-stack-presets";

async function getDisplayStackGroups() {
  try {
    const items = await listVisibleSiteTechStackItemsFromSupabase();
    if (items.length === 0) return stackGroups;

    const grouped = new Map<string, string[]>();
    for (const group of siteStackGroups) grouped.set(group, []);

    for (const item of items) {
      const groupName = item.groupName || "Cloud & DevX";
      grouped.set(groupName, [...(grouped.get(groupName) ?? []), item.name]);
    }

    return Array.from(grouped.entries())
      .map(([title, items]) => ({ title, items }))
      .filter((group) => group.items.length > 0);
  } catch {
    return stackGroups;
  }
}

export async function TechStackSection() {
  const displayGroups = await getDisplayStackGroups();
  return <TechStackClient groups={displayGroups} />;
}
