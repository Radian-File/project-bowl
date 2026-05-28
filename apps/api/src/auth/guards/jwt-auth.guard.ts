import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AppEnvironment } from "../../common/config/env.validation";
import { UserRole } from "../../common/enums/domain.enums";
import { AuthenticatedUser } from "../types/authenticated-user";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

function isMissingOrPlaceholder(value: string | undefined): boolean {
  return !value || value.trim() === "" || value === "replace-me";
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppEnvironment, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const secret = this.configService.get("JWT_ACCESS_SECRET", { infer: true });
    if (isMissingOrPlaceholder(secret)) {
      throw new ServiceUnavailableException("JWT access secret is not configured");
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret,
      });
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
