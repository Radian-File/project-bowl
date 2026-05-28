import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MilestoneStatus, Prisma, ProjectVisibility, TaskStatus } from "@prisma/client";
import { slugify } from "../common/utils/slugify";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectImageDto } from "./dto/project-image.dto";
import { ProjectQueryDto } from "./dto/project-query.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

const projectInclude = {
  owner: {
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  },
  techStacks: {
    include: {
      techStack: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
  images: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ProjectInclude;

function isKnownPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

function toDate(value: string | undefined): Date | undefined {
  return value ? new Date(value) : undefined;
}

function mapImages(images: ProjectImageDto[] | undefined): Prisma.ProjectImageCreateWithoutProjectInput[] | undefined {
  return images?.map((image, index) => ({
    type: image.type,
    url: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height,
    sortOrder: image.sortOrder ?? index,
  }));
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectQueryDto = {}) {
    return this.prisma.project.findMany({
      where: {
        status: query.status,
        visibility: query.visibility,
        isFeatured: query.isFeatured,
        techStacks: query.techStackId
          ? {
              some: {
                techStackId: query.techStackId,
              },
            }
          : undefined,
        OR: query.search
          ? [
              { title: { contains: query.search, mode: "insensitive" } },
              { summary: { contains: query.search, mode: "insensitive" } },
              { description: { contains: query.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: projectInclude,
      orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} was not found`);
    }

    return project;
  }

  async create(dto: CreateProjectDto, userId?: string) {
    const { images, ownerId, techStackIds, ...projectFields } = dto;
    const visibility = projectFields.visibility ?? ProjectVisibility.PRIVATE;
    const publishedAt =
      projectFields.publishedAt !== undefined
        ? toDate(projectFields.publishedAt)
        : visibility === ProjectVisibility.PUBLIC
          ? new Date()
          : undefined;

    try {
      const project = await this.prisma.project.create({
        data: {
          ...projectFields,
          slug: projectFields.slug ?? slugify(projectFields.title),
          visibility,
          publishedAt,
          startedAt: toDate(projectFields.startedAt),
          completedAt: toDate(projectFields.completedAt),
          owner: ownerId ? { connect: { id: ownerId } } : undefined,
          techStacks: techStackIds
            ? {
                create: techStackIds.map((techStackId, index) => ({
                  sortOrder: index,
                  techStack: { connect: { id: techStackId } },
                })),
              }
            : undefined,
          images: images
            ? {
                create: mapImages(images),
              }
            : undefined,
        },
        include: projectInclude,
      });

      await this.logActivity({
        projectId: project.id,
        userId,
        action: "project.created",
        entityId: project.id,
        message: `Created project \"${project.title}\"`,
      });

      return project;
    } catch (error) {
      if (isKnownPrismaError(error, "P2002")) {
        throw new ConflictException("A project with this slug already exists");
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateProjectDto, userId?: string) {
    const existing = await this.prisma.project.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Project ${id} was not found`);
    }

    const { images, ownerId, techStackIds, ...projectFields } = dto;
    const publishedAt =
      projectFields.publishedAt !== undefined
        ? toDate(projectFields.publishedAt)
        : projectFields.visibility === ProjectVisibility.PUBLIC && existing.publishedAt === null
          ? new Date()
          : undefined;

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (techStackIds !== undefined) {
          await tx.projectTechStack.deleteMany({ where: { projectId: id } });

          if (techStackIds.length > 0) {
            await tx.projectTechStack.createMany({
              data: techStackIds.map((techStackId, index) => ({
                projectId: id,
                techStackId,
                sortOrder: index,
              })),
            });
          }
        }

        if (images !== undefined) {
          await tx.projectImage.deleteMany({ where: { projectId: id } });

          const mappedImages = mapImages(images);
          if (mappedImages && mappedImages.length > 0) {
            await tx.projectImage.createMany({
              data: mappedImages.map((image) => ({
                ...image,
                projectId: id,
              })),
            });
          }
        }

        const project = await tx.project.update({
          where: { id },
          data: {
            ...projectFields,
            publishedAt,
            startedAt: toDate(projectFields.startedAt),
            completedAt: toDate(projectFields.completedAt),
            owner:
              ownerId === undefined
                ? undefined
                : ownerId === null
                  ? { disconnect: true }
                  : { connect: { id: ownerId } },
          },
          include: projectInclude,
        });

        await tx.activityLog.create({
          data: {
            projectId: project.id,
            userId,
            action: "project.updated",
            entityType: "project",
            entityId: project.id,
            message: `Updated project \"${project.title}\"`,
          },
        });

        return project;
      });
    } catch (error) {
      if (isKnownPrismaError(error, "P2002")) {
        throw new ConflictException("A project with this slug already exists");
      }

      throw error;
    }
  }

  async remove(id: string, userId?: string) {
    try {
      const project = await this.prisma.project.delete({ where: { id } });
      await this.logActivity({
        projectId: undefined,
        userId,
        action: "project.deleted",
        entityId: project.id,
        message: `Deleted project \"${project.title}\"`,
      });
      return { id, deleted: true };
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Project ${id} was not found`);
      }

      throw error;
    }
  }

  async findPublished() {
    return this.prisma.project.findMany({
      where: {
        visibility: ProjectVisibility.PUBLIC,
        publishedAt: { not: null },
      },
      include: projectInclude,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    });
  }

  async getProgress(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${id} was not found`);
    }

    const [totalTasks, completedTasks, totalMilestones, completedMilestones] = await Promise.all([
      this.prisma.task.count({ where: { projectId: id } }),
      this.prisma.task.count({ where: { projectId: id, status: TaskStatus.DONE } }),
      this.prisma.projectMilestone.count({ where: { projectId: id } }),
      this.prisma.projectMilestone.count({ where: { projectId: id, status: MilestoneStatus.COMPLETED } }),
    ]);

    const totalItems = totalTasks + totalMilestones;
    const completedItems = completedTasks + completedMilestones;

    return {
      project,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
      },
      milestones: {
        total: totalMilestones,
        completed: completedMilestones,
      },
      progressPercentage: totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100),
    };
  }

  async findPublishedBySlug(slug: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        slug,
        visibility: ProjectVisibility.PUBLIC,
        publishedAt: { not: null },
      },
      include: projectInclude,
    });

    if (!project) {
      throw new NotFoundException(`Published project ${slug} was not found`);
    }

    return project;
  }

  private logActivity(input: {
    projectId?: string;
    userId?: string;
    action: string;
    entityId: string;
    message: string;
  }) {
    return this.prisma.activityLog.create({
      data: {
        projectId: input.projectId,
        userId: input.userId,
        action: input.action,
        entityType: "project",
        entityId: input.entityId,
        message: input.message,
      },
    });
  }
}
