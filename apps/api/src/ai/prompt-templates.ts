import { GenerateCaseStudyDto } from "./dto/generate-case-study.dto";
import { GenerateDescriptionDto } from "./dto/generate-description.dto";
import { GenerateReadmeDto } from "./dto/generate-readme.dto";
import { RewriteDto } from "./dto/rewrite.dto";
import { TranslateDto } from "./dto/translate.dto";

function list(values: string[] | undefined): string {
  return values && values.length > 0 ? values.join(", ") : "Not provided";
}

export const systemPrompt =
  "You are ProjectBowl's backend AI assistant. Produce polished portfolio drafts for admin review. Do not claim content is published. Keep output practical, concise, and ready to edit.";

export function descriptionPrompt(dto: GenerateDescriptionDto): string {
  return `Draft a compelling project description for a portfolio admin dashboard.\nTitle: ${dto.title}\nSummary: ${dto.summary ?? "Not provided"}\nProblem: ${dto.problem ?? "Not provided"}\nSolution: ${dto.solution ?? "Not provided"}\nTech stack: ${list(dto.techStack)}\nTone: ${dto.tone ?? "professional and clear"}\nReturn 2 short paragraphs plus 3 bullet highlights.`;
}

export function readmePrompt(dto: GenerateReadmeDto): string {
  return `Create a README.md draft for this project.\nTitle: ${dto.title}\nSummary: ${dto.summary}\nDescription: ${dto.description ?? "Not provided"}\nTech stack: ${list(dto.techStack)}\nRepository URL: ${dto.repositoryUrl ?? "Not provided"}\nLive URL: ${dto.liveUrl ?? "Not provided"}\nInclude: overview, features, tech stack, getting started, environment variables placeholder section, and links.`;
}

export function caseStudyPrompt(dto: GenerateCaseStudyDto): string {
  return `Draft a concise case study for admin review.\nTitle: ${dto.title}\nSummary: ${dto.summary}\nProblem: ${dto.problem ?? "Not provided"}\nSolution: ${dto.solution ?? "Not provided"}\nOutcome: ${dto.outcome ?? "Not provided"}\nTech stack: ${list(dto.techStack)}\nUse sections: Context, Challenge, Approach, Implementation, Results, Next Steps.`;
}

export function rewritePrompt(dto: RewriteDto): string {
  return `Rewrite the following text for a ProjectBowl portfolio entry.\nTone: ${dto.tone ?? "clear and polished"}\nInstruction: ${dto.instruction ?? "Improve clarity while preserving meaning."}\nText:\n${dto.text}`;
}

export function translatePrompt(dto: TranslateDto): string {
  return `Translate the following text from ${dto.sourceLanguage ?? "auto-detected language"} to ${dto.targetLanguage}. Preserve markdown formatting and technical terms where appropriate.\nText:\n${dto.text}`;
}
