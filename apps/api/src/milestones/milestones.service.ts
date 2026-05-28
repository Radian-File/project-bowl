import { Injectable, NotFoundException } from "@nestjs/common";
import { MilestoneStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMilestoneDto } from "./dto/create-milestone.dto";
import { MilestoneQueryDto } from "./dto/milestone-query.dto";
import { UpdateMilestoneDto } from "./dto/update-milestone.dto";

function toDate(value: string | null | undefined): Date | null | undefined {
  if (value === null) {
    return null;
  }
  return value ? new Date(value) : undefined;
}

function isKnownPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

@Injectable()
export class MilestonesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: MilestoneQueryDto) {
    return this.prisma.projectMilestone.findMany({
      where: {
        projectId: query.projectId,
        status: query.status,
      },
      include: { project: { select: { id: true, title: true, slug: true } } },
      orderBy: [{ sortOrder: "asc" }, { targetDate: "asc" }, { createdAt: "asc" }],
    });
  }

  async findOne(id: string) {
    const milestone = await this.prisma.projectMilestone.findUnique({
      where: { id },
      include: { project: { select: { id: true, title: true, slug: true } } },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone ${id} was not found`);
    }

    return milestone;
  }

  async create(dto: CreateMilestoneDto, userId: string) {
    const status = dto.status ?? MilestoneStatus.PLANNED;
    const milestone = await this.prisma.projectMilestone.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        status,
        targetDate: toDate(dto.targetDate),
        completedAt: status === MilestoneStatus.COMPLETED ? new Date() : undefined,
        sortOrder: dto.sortOrder,
      },
    });

    await this.logActivity({
      projectId: milestone.projectId,
      userId,
      action: "milestone.created",
      entityId: milestone.id,
      message: `Created milestone \"${milestone.title}\"`,
    });

    return this.findOne(milestone.id);
  }

  async update(id: string, dto: UpdateMilestoneDto, userId: string) {
    try {
      const milestone = await this.prisma.projectMilestone.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          targetDate: toDate(dto.targetDate),
          sortOrder: dto.sortOrder,
          completedAt:
            dto.status === undefined
              ? undefined
              : dto.status === MilestoneStatus.COMPLETED
                ? new Date()
                : null,
        },
      });

      await this.logActivity({
        projectId: milestone.projectId,
        userId,
        action: "milestone.updated",
        entityId: milestone.id,
        message: `Updated milestone \"${milestone.title}\"`,
      });

      return this.findOne(milestone.id);
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Milestone ${id} was not found`);
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      const milestone = await this.prisma.projectMilestone.delete({ where: { id } });
      await this.logActivity({
        projectId: milestone.projectId,
        userId,
        action: "milestone.deleted",
        entityId: milestone.id,
        message: `Deleted milestone \"${milestone.title}\"`,
      });
      return { id, deleted: true };
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Milestone ${id} was not found`);
      }
      throw error;
    }
  }

  private logActivity(input: { projectId: string; userId: string; action: string; entityId: string; message: string }) {
    return this.prisma.activityLog.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        action: input.action,
        entityType: "milestone",
        entityId: input.entityId,
        message: input.message,
      },
    });
  }
}
