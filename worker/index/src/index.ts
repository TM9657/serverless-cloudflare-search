import { CorsResponse } from "util/cors";
import { SearchQueueMessage } from "util/types";
import config from "../../../config.json";
export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;

  SEARCH_INDEXING_QUEUE: Queue<SearchQueueMessage>;
}

type IndexingBody = {
  key: string;
  content: SearchQueueMessage;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const body: IndexingBody = await request.json();
    // could be replaced with crypto constant time compare (not necessary for our key security)
    if (body.key !== config.secret)
      return new CorsResponse("Invalid key", 401).finalize(request);
    await env.SEARCH_INDEXING_QUEUE.send(body.content);
    return new CorsResponse("").finalize(request);
  },
};
