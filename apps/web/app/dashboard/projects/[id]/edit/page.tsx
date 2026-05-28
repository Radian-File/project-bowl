"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, SectionLabel } from "@projectbowl/ui";
import { ProjectForm } from "@/components/dashboard/project-form";
import { ApiProject, getProjectById } from "@/lib/api";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getProjectById(params.id)
      .then((item) => {
        if (active) setProject(item);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load project.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Edit project</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">{project?.title ?? "Project settings"}</h2>
        <p className="mt-3 max-w-2xl text-slate-400">Update public/private visibility, status, content, stack selections, and thumbnail URL.</p>
      </div>

      {isLoading ? <Card className="flex items-center gap-3 p-6 text-slate-300"><Loader2 className="h-5 w-5 animate-spin text-cyan-200" /> Loading project...</Card> : null}
      {error ? <div className="flex gap-2 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm text-rose-100"><AlertCircle className="h-5 w-5 shrink-0" /> {error}</div> : null}
      {project ? <ProjectForm mode="edit" initialProject={project} /> : null}
    </div>
  );
}
