import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TaskStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

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
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: TaskQueryDto) {
    return this.prisma.task.findMany({
      where: {
        projectId: query.projectId,
        status: query.status,
        OR: query.search
          ? [
              { title: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: { project: { select: { id: true, title: true, slug: true } }, createdBy: { select: { id: true, email: true, name: true } } },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: { select: { id: true, title: true, slug: true } }, createdBy: { select: { id: true, email: true, name: true } } },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} was not found`);
    }

    return task;
  }

  async create(dto: CreateTaskDto, userId: string) {
    const status = dto.status ?? TaskStatus.TODO;
    const task = await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        status,
        priority: dto.priority,
        dueDate: toDate(dto.dueDate),
        completedAt: status === TaskStatus.DONE ? new Date() : undefined,
        createdById: userId,
      },
    });

    await this.logActivity({
      projectId: task.projectId,
      userId,
      action: "task.created",
      entityId: task.id,
      message: `Created task \"${task.title}\"`,
    });

    return this.findOne(task.id);
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
          dueDate: toDate(dto.dueDate),
          completedAt:
            dto.status === undefined
              ? undefined
              : dto.status === TaskStatus.DONE
                ? new Date()
                : null,
        },
      });

      await this.logActivity({
        projectId: task.projectId,
        userId,
        action: "task.updated",
        entityId: task.id,
        message: `Updated task \"${task.title}\"`,
      });

      return this.findOne(task.id);
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Task ${id} was not found`);
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      const task = await this.prisma.task.delete({ where: { id } });
      await this.logActivity({
        projectId: task.projectId,
        userId,
        action: "task.deleted",
        entityId: task.id,
        message: `Deleted task \"${task.title}\"`,
      });
      return { id, deleted: true };
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Task ${id} was not found`);
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
        entityType: "task",
        entityId: input.entityId,
        message: input.message,
      },
    });
  }
}
