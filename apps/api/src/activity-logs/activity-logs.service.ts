import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ActivityLogQueryDto } from "./dto/activity-log-query.dto";
import { CreateActivityLogDto } from "./dto/create-activity-log.dto";

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ActivityLogQueryDto) {
    return this.prisma.activityLog.findMany({
      where: {
        projectId: query.projectId,
        entityType: query.entityType,
        entityId: query.entityId,
      },
      include: {
        project: { select: { id: true, title: true, slug: true } },
        user: { select: { id: true, email: true, name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: query.limit ?? 50,
    });
  }

  create(dto: CreateActivityLogDto, userId: string) {
    return this.prisma.activityLog.create({
      data: {
        projectId: dto.projectId,
        userId,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId,
        message: dto.message,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
