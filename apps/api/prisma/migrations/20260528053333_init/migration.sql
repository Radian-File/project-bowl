-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IDEA', 'PLANNING', 'IN_PROGRESS', 'SHIPPED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'UNLISTED');

-- CreateEnum
CREATE TYPE "TechStackCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'AI', 'DEVOPS', 'DESIGN', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectImageType" AS ENUM ('COVER', 'GALLERY', 'LOGO', 'SCREENSHOT');

-- CreateEnum
CREATE TYPE "AiGenerationType" AS ENUM ('PROJECT_BRIEF', 'CASE_STUDY', 'README', 'IMAGE_PROMPT', 'OTHER');

-- CreateEnum
CREATE TYPE "AiGenerationStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "problem" TEXT,
    "solution" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IDEA',
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PRIVATE',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "repositoryUrl" TEXT,
    "liveUrl" TEXT,
    "caseStudyUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "TechStackCategory" NOT NULL DEFAULT 'OTHER',
    "iconUrl" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTechStack" (
    "projectId" TEXT NOT NULL,
    "techStackId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectTechStack_pkey" PRIMARY KEY ("projectId","techStackId")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectImageType" NOT NULL DEFAULT 'GALLERY',
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiGenerationLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "userId" TEXT,
    "type" "AiGenerationType" NOT NULL DEFAULT 'OTHER',
    "status" "AiGenerationStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" TEXT,
    "model" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiGenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_visibility_publishedAt_idx" ON "Project"("visibility", "publishedAt");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_isFeatured_idx" ON "Project"("isFeatured");

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "Project"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "TechStack_name_key" ON "TechStack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStack_slug_key" ON "TechStack"("slug");

-- CreateIndex
CREATE INDEX "TechStack_category_idx" ON "TechStack"("category");

-- CreateIndex
CREATE INDEX "ProjectTechStack_techStackId_idx" ON "ProjectTechStack"("techStackId");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_type_idx" ON "ProjectImage"("projectId", "type");

-- CreateIndex
CREATE INDEX "AiGenerationLog_projectId_idx" ON "AiGenerationLog"("projectId");

-- CreateIndex
CREATE INDEX "AiGenerationLog_userId_idx" ON "AiGenerationLog"("userId");

-- CreateIndex
CREATE INDEX "AiGenerationLog_status_idx" ON "AiGenerationLog"("status");

-- CreateIndex
CREATE INDEX "AiGenerationLog_type_idx" ON "AiGenerationLog"("type");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechStack" ADD CONSTRAINT "ProjectTechStack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechStack" ADD CONSTRAINT "ProjectTechStack_techStackId_fkey" FOREIGN KEY ("techStackId") REFERENCES "TechStack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGenerationLog" ADD CONSTRAINT "AiGenerationLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGenerationLog" ADD CONSTRAINT "AiGenerationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
