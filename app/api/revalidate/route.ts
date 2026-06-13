import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { clearPropertyCache } from "@/lib/properties";

export async function POST(request: Request) {
  let bodySecret: string | undefined;
  try {
    const body = (await request.json()) as { secret?: string };
    bodySecret = body.secret;
  } catch {
    bodySecret = undefined;
  }

  const secret =
    request.headers.get("x-revalidate-secret") ?? bodySecret;

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  clearPropertyCache();

  revalidatePath("/", "layout");
  revalidatePath("/properties");
  revalidatePath("/properties/[slug]", "page");
  revalidatePath("/[location]", "page");

  const hook = process.env.NETLIFY_BUILD_HOOK_URL;
  if (hook) {
    await fetch(hook, { method: "POST" }).catch(() => undefined);
  }

  return NextResponse.json({ revalidated: true, timestamp: Date.now() });
}
