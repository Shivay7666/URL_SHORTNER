import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Url from "@/models/Url";
import redis from "@/lib/redis";

export default async function RedirectPage({ params }: { params: Promise<{ shortId: string }> }) {
  const { shortId } = await params; // ✅ Fix: Await params

  if (!shortId) {
    return redirect("/"); // ✅ Redirect to home if shortId is missing
  }

  // ✅ Check Redis cache first
  const cachedUrl = await redis.get(shortId);
  if (cachedUrl) {
    redirect(cachedUrl);
  }

  await connectToDatabase();
  const urlDoc = await Url.findOne({ shortId });

  if (urlDoc) {
    // ✅ Cache in Redis for future lookups
    await redis.set(shortId, urlDoc.originalUrl, "EX", 86400);
    redirect(urlDoc.originalUrl);
  }

  return redirect("/"); // ✅ If URL not found, redirect to home
}
