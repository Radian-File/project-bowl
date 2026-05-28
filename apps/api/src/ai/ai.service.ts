import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiGenerationStatus, AiGenerationType } from "@prisma/client";
import { AppEnvironment } from "../common/config/env.validation";
import { PrismaService } from "../prisma/prisma.service";
import { GenerateCaseStudyDto } from "./dto/generate-case-study.dto";
import { GenerateDescriptionDto } from "./dto/generate-description.dto";
import { GenerateReadmeDto } from "./dto/generate-readme.dto";
import { RewriteDto } from "./dto/rewrite.dto";
import { TranslateDto } from "./dto/translate.dto";
import {
  caseStudyPrompt,
  descriptionPrompt,
  readmePrompt,
  rewritePrompt,
  systemPrompt,
  translatePrompt,
} from "./prompt-templates";

interface OpenRouterChoice {
  message?: {
    content?: string;
  };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: {
    message?: string;
  };
}

function isMissingOrPlaceholder(value: string | undefined): boolean {
  return !value || value.trim() === "" || value === "replace-me";
}

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService<AppEnvironment, true>,
  ) {}

  generateDescription(dto: GenerateDescriptionDto, userId: string) {
    return this.generateDraft({
      prompt: descriptionPrompt(dto),
      projectId: dto.projectId,
      type: AiGenerationType.PROJECT_BRIEF,
      userId,
    });
  }

  generateReadme(dto: GenerateReadmeDto, userId: string) {
    return this.generateDraft({
      prompt: readmePrompt(dto),
      projectId: dto.projectId,
      type: AiGenerationType.README,
      userId,
    });
  }

  generateCaseStudy(dto: GenerateCaseStudyDto, userId: string) {
    return this.generateDraft({
      prompt: caseStudyPrompt(dto),
      projectId: dto.projectId,
      type: AiGenerationType.CASE_STUDY,
      userId,
    });
  }

  rewrite(dto: RewriteDto, userId: string) {
    return this.generateDraft({
      prompt: rewritePrompt(dto),
      projectId: dto.projectId,
      type: AiGenerationType.OTHER,
      userId,
    });
  }

  translate(dto: TranslateDto, userId: string) {
    return this.generateDraft({
      prompt: translatePrompt(dto),
      projectId: dto.projectId,
      type: AiGenerationType.OTHER,
      userId,
    });
  }

  private async generateDraft(input: {
    prompt: string;
    projectId?: string;
    type: AiGenerationType;
    userId: string;
  }) {
    const apiKey = this.configService.get("OPENROUTER_API_KEY", { infer: true });
    const model = this.configService.get("OPENROUTER_MODEL", { infer: true });

    if (isMissingOrPlaceholder(apiKey)) {
      const failedLog = await this.createLog({
        ...input,
        model,
        status: AiGenerationStatus.FAILED,
        errorMessage: "OpenRouter API key is not configured",
      });
      throw new ServiceUnavailableException({
        message: "OpenRouter API key is not configured",
        logId: failedLog.id,
      });
    }

    try {
      const result = await this.callOpenRouter(apiKey, model, input.prompt);
      const log = await this.createLog({
        ...input,
        model,
        status: AiGenerationStatus.SUCCEEDED,
        response: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
      });

      return {
        draft: result.content,
        logId: log.id,
        model,
        type: input.type,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "OpenRouter request failed";
      const log = await this.createLog({
        ...input,
        model,
        status: AiGenerationStatus.FAILED,
        errorMessage: message,
      });
      throw new ServiceUnavailableException({
        message,
        logId: log.id,
      });
    }
  }

  private async callOpenRouter(apiKey: string, model: string, prompt: string) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "ProjectBowl Admin",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as OpenRouterResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message ?? `OpenRouter request failed with ${response.status}`);
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("OpenRouter returned an empty response");
    }

    return {
      content,
      inputTokens: payload.usage?.prompt_tokens,
      outputTokens: payload.usage?.completion_tokens,
    };
  }

  private createLog(input: {
    projectId?: string;
    userId: string;
    type: AiGenerationType;
    prompt: string;
    model: string;
    status: AiGenerationStatus;
    response?: string;
    inputTokens?: number;
    outputTokens?: number;
    errorMessage?: string;
  }) {
    return this.prisma.aiGenerationLog.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        type: input.type,
        status: input.status,
        provider: "openrouter",
        model: input.model,
        prompt: input.prompt,
        response: input.response,
        inputTokens: input.inputTokens,
        outputTokens: input.outputTokens,
        errorMessage: input.errorMessage,
      },
    });
  }
}
