import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Unexpected server error.";
  return NextResponse.json({ message }, { status });
}

export async function readJson<T>(request: Request): Promise<T> {
  const text = await request.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
