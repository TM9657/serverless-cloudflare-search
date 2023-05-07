let searchCache: Cache | null = null;
export async function cachePut(index: string, serialized: string) {
  if (!searchCache) searchCache = await caches.open("custom:serverless-search");
  if (!searchCache) return undefined;
  const key = cacheKey(index);
  return await searchCache.put(
    key,
    new Response(serialized, {
      headers: {
        "Cache-Control": "public, max-age=2678400",
        Expires: new Date(Date.now() + 2678400 * 1000).toUTCString(),
        "Last-Modified": new Date().toUTCString(),
      },
    })
  );
}

export async function cacheGet(index: string) {
  if (!searchCache) searchCache = await caches.open("custom:serverless-search");
  if (!searchCache) return undefined;
  const key = cacheKey(index);
  return await (await searchCache.match(key))?.text();
}

function cacheKey(index: string) {
  return new Request(new URL(`https://${index}.search`).toString());
}
