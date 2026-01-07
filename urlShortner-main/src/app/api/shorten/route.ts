import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { connectToDatabase } from "@/lib/mongodb";
import Url from "@/models/Url";

export async function POST(req: Request) {
  await connectToDatabase();
  const { originalUrl, expiry } = await req.json();

  if (!originalUrl || !originalUrl.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const shortId = Math.random().toString(36).substr(2, 6);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const newUrl = await Url.create({ originalUrl, shortId, expiresAt: new Date(Date.now() + expiry * 1000) });

  // ✅ Store in Redis with Custom Expiry
  await redis.set(shortId, originalUrl, "EX", expiry);

  return NextResponse.json({ shortUrl: `${baseUrl}/${shortId}` });
}
