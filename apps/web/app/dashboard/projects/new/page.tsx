import { SectionLabel } from "@projectbowl/ui";
import { ProjectForm } from "@/components/dashboard/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Create project</SectionLabel>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Add a portfolio record.</h2>
        <p className="mt-3 max-w-2xl text-slate-400">Draft the content, status, visibility, links, thumbnail URL, and stack metadata before publishing.</p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
