import { CorsResponse } from "util/cors";
import { MiniSearch } from "util/types";
import config from "../../../config.json";
import { loadIndex } from "util";
import { cachePut, cacheGet } from "util/cache";
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  SEARCH_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}

let indices = new Map<string, MiniSearch<any>>();

type SearchBody = {
  index: string;
  term: string;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const { index, term }: SearchBody = await request.json();
    console.log("index: " + index + " term: ", term);
    if (!index || !term)
      return new CorsResponse("Invalid request", 400).finalize(request);
    if (term.length < config.minSearch)
      return new CorsResponse("Term too short", 400).finalize(request);
    if (!indices.has(index)) {
      let serialized = await cacheGet(index);
      if (!serialized) {
        console.log("cache miss");
        serialized = await (await env.SEARCH_BUCKET.get(index))?.text();
        if (serialized) await cachePut(index, serialized);
      } else {
        console.log("cache hit");
      }
      if (!serialized)
        return new CorsResponse("Index not found", 404).finalize(request);
      const deserialized = await loadIndex(serialized);
      indices.set(index, deserialized);
    }
    const result = indices.get(index);
    if (!result)
      return new CorsResponse("Index not found, internal error", 404).finalize(
        request
      );
    const search = result.search(term);
    return new CorsResponse(JSON.stringify(search)).finalize(request);
  },
};
