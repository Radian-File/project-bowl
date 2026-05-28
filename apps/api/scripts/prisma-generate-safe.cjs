#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(command, ["exec", "prisma", "generate", "--schema", "prisma/schema.prisma"], {
  cwd: path.resolve(__dirname, ".."),
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status === 0) {
  process.exit(0);
}

function hasGeneratedClient() {
  try {
    const clientEntry = require.resolve("@prisma/client");
    require.resolve(".prisma/client/default.js", {
      paths: [path.dirname(clientEntry)],
    });
    return true;
  } catch {
    return false;
  }
}

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const isWindowsFileLock = process.platform === "win32" && /EPERM: operation not permitted, rename/.test(output);

if (isWindowsFileLock && hasGeneratedClient()) {
  console.warn(
    "Prisma generate hit a Windows file-lock while replacing the query engine, but an existing generated client is available. Continuing.",
  );
  process.exit(0);
}

process.exit(result.status ?? 1);
