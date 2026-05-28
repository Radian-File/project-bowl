import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user";
import { UserRole } from "../common/enums/domain.enums";
import { AiService } from "./ai.service";
import { GenerateCaseStudyDto } from "./dto/generate-case-study.dto";
import { GenerateDescriptionDto } from "./dto/generate-description.dto";
import { GenerateReadmeDto } from "./dto/generate-readme.dto";
import { RewriteDto } from "./dto/rewrite.dto";
import { TranslateDto } from "./dto/translate.dto";

@ApiTags("AI")
@ApiBearerAuth()
@Controller("ai")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.EDITOR)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate/description")
  generateDescription(@Body() dto: GenerateDescriptionDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.generateDescription(dto, user.userId);
  }

  @Post("generate/readme")
  generateReadme(@Body() dto: GenerateReadmeDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.generateReadme(dto, user.userId);
  }

  @Post("generate/case-study")
  generateCaseStudy(@Body() dto: GenerateCaseStudyDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.generateCaseStudy(dto, user.userId);
  }

  @Post("rewrite")
  rewrite(@Body() dto: RewriteDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.rewrite(dto, user.userId);
  }

  @Post("translate")
  translate(@Body() dto: TranslateDto, @CurrentUser() user: AuthenticatedUser) {
    return this.aiService.translate(dto, user.userId);
  }
}
