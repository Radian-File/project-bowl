import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@prisma/client";
import { AppEnvironment } from "../common/config/env.validation";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";

interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    role: UserRole;
  };
}

function isMissingOrPlaceholder(value: string | undefined): boolean {
  return !value || value.trim() === "" || value === "replace-me";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppEnvironment, true>,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    this.assertJwtConfig();

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.issueTokenPair(user);
  }

  async refresh(dto: RefreshDto): Promise<AuthResponse> {
    this.assertJwtConfig();

    const refreshSecret = this.configService.get("JWT_REFRESH_SECRET", { infer: true });
    let payload: RefreshTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(dto.refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    const tokenMatches = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!tokenMatches) {
      throw new UnauthorizedException("Refresh token has been revoked");
    }

    return this.issueTokenPair(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });

    return { loggedOut: true };
  }

  private async issueTokenPair(user: User): Promise<AuthResponse> {
    const accessSecret = this.configService.get("JWT_ACCESS_SECRET", { infer: true });
    const refreshSecret = this.configService.get("JWT_REFRESH_SECRET", { infer: true });
    const accessExpiresInValue = this.configService.get("JWT_ACCESS_EXPIRES_IN", { infer: true });
    const refreshExpiresInValue = this.configService.get("JWT_REFRESH_EXPIRES_IN", { infer: true });
    const accessExpiresIn = accessExpiresInValue as JwtSignOptions["expiresIn"];
    const refreshExpiresIn = refreshExpiresInValue as JwtSignOptions["expiresIn"];
    const payload: RefreshTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await bcrypt.hash(refreshToken, 12) },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: accessExpiresInValue,
      user: this.toSafeUser(user),
    };
  }

  private assertJwtConfig() {
    const accessSecret = this.configService.get("JWT_ACCESS_SECRET", { infer: true });
    const refreshSecret = this.configService.get("JWT_REFRESH_SECRET", { infer: true });

    if (isMissingOrPlaceholder(accessSecret) || isMissingOrPlaceholder(refreshSecret)) {
      throw new ServiceUnavailableException("JWT secrets are not configured");
    }
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }
}
