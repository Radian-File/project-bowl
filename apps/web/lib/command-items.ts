import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Copy, FileText, FolderGit2, Github, Home, Languages, Linkedin, Mail, Twitter } from "lucide-react";
import { profile, projects } from "@/lib/portfolio-data";

export type CommandGroup = "Navigation" | "Actions" | "Projects";

export type CommandItem = {
  id: string;
  label: string;
  group: CommandGroup;
  icon: LucideIcon;
  /** Extra text matched against the search query. */
  keywords?: string;
  /** What happens on select. Returns true to keep the palette open. */
  perform: () => boolean | void;
};

type BuildCommandItemsArgs = {
  navigate: (href: string) => void;
  copyEmail: () => void;
  openExternal: (href: string) => void;
  toggleLanguage: () => void;
};

export function buildCommandItems({ navigate, copyEmail, openExternal, toggleLanguage }: BuildCommandItemsArgs): CommandItem[] {
  const socialIcon: Record<string, LucideIcon> = {
    GitHub: Github,
    LinkedIn: Linkedin,
    X: Twitter,
  };

  return [
    // Navigation
    { id: "nav-home", label: "Home", group: "Navigation", icon: Home, keywords: "top start", perform: () => navigate("/") },
    { id: "nav-about", label: "About", group: "Navigation", icon: Home, keywords: "tentang saya", perform: () => navigate("/#about") },
    { id: "nav-projects", label: "Projects", group: "Navigation", icon: FolderGit2, keywords: "work karya", perform: () => navigate("/#projects") },
    { id: "nav-projectbowl", label: "ProjectBowl", group: "Navigation", icon: FolderGit2, keywords: "cms flagship", perform: () => navigate("/#projectbowl") },
    { id: "nav-ai", label: "AI Features", group: "Navigation", icon: FolderGit2, keywords: "ai studio", perform: () => navigate("/#ai") },
    { id: "nav-stack", label: "Tech Stack", group: "Navigation", icon: FolderGit2, keywords: "tools skills", perform: () => navigate("/#stack") },
    { id: "nav-contact", label: "Contact", group: "Navigation", icon: Mail, keywords: "email hubungi", perform: () => navigate("/#contact") },
    { id: "nav-cv", label: "CV", group: "Navigation", icon: FileText, keywords: "resume curriculum", perform: () => navigate("/cv") },

    // Actions
    { id: "act-copy-email", label: "Copy email", group: "Actions", icon: Copy, keywords: profile.email, perform: () => copyEmail() },
    { id: "act-lang", label: "Toggle language (ID / EN)", group: "Actions", icon: Languages, keywords: "bahasa indonesia english", perform: () => toggleLanguage() },
    ...profile.socials.map((social) => ({
      id: `act-${social.label.toLowerCase()}`,
      label: `Open ${social.label}`,
      group: "Actions" as const,
      icon: socialIcon[social.label] ?? ArrowUpRight,
      keywords: social.handle,
      perform: () => openExternal(social.href),
    })),

    // Projects
    ...projects.map((project) => ({
      id: `proj-${project.slug}`,
      label: project.title,
      group: "Projects" as const,
      icon: ArrowUpRight,
      keywords: `${project.badge} ${project.tech.join(" ")}`,
      perform: () => navigate(`/projects/${project.slug}`),
    })),
  ];
}

export function filterCommandItems(items: CommandItem[], query: string): CommandItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => `${item.label} ${item.group} ${item.keywords ?? ""}`.toLowerCase().includes(q));
}
