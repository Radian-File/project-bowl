import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

function loadEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^['\"]|['\"]$/g, "");
    process.env[key] ??= value;
  }
}

function isMissingOrPlaceholder(value: string | undefined) {
  return !value || value.trim() === "" || value === "replace-me";
}

loadEnvFile(resolve(__dirname, "../../../.env"));
loadEnvFile(resolve(__dirname, "../.env"));

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "ProjectBowl Admin";

  if (isMissingOrPlaceholder(email) || isMissingOrPlaceholder(password)) {
    console.log("Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
    return;
  }

  const adminEmail = email as string;
  const adminPassword = password as string;
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name,
      role: UserRole.ADMIN,
      passwordHash,
    },
    create: {
      email: adminEmail,
      name,
      role: UserRole.ADMIN,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  console.log(`Seeded admin user: ${admin.email} (${admin.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
