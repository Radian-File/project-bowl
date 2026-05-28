import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { slugify } from "../common/utils/slugify";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTechStackDto } from "./dto/create-tech-stack.dto";
import { UpdateTechStackDto } from "./dto/update-tech-stack.dto";

function isKnownPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

@Injectable()
export class TechStacksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.techStack.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
  }

  async findOne(id: string) {
    const techStack = await this.prisma.techStack.findUnique({ where: { id } });

    if (!techStack) {
      throw new NotFoundException(`Tech stack ${id} was not found`);
    }

    return techStack;
  }

  async create(dto: CreateTechStackDto) {
    try {
      return await this.prisma.techStack.create({
        data: {
          ...dto,
          slug: dto.slug ?? slugify(dto.name),
        },
      });
    } catch (error) {
      if (isKnownPrismaError(error, "P2002")) {
        throw new ConflictException("A tech stack with this name or slug already exists");
      }

      throw error;
    }
  }

  async update(id: string, dto: UpdateTechStackDto) {
    try {
      return await this.prisma.techStack.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Tech stack ${id} was not found`);
      }

      if (isKnownPrismaError(error, "P2002")) {
        throw new ConflictException("A tech stack with this name or slug already exists");
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.techStack.delete({ where: { id } });
      return { id, deleted: true };
    } catch (error) {
      if (isKnownPrismaError(error, "P2025")) {
        throw new NotFoundException(`Tech stack ${id} was not found`);
      }

      throw error;
    }
  }
}
