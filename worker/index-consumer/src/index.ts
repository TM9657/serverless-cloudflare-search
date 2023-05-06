import { loadIndex, saveIndex } from "util";
import { SearchQueueMessage, Options, MiniSearch } from "util/types";
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

// caching the index, concurrency max 1, so no parallel data is missed
let indices = new Map<
  string,
  { index: MiniSearch<any>; config: Options<any> }
>();

export default {
  async queue(
    batch: MessageBatch<SearchQueueMessage>,
    env: Env,
    ctx: ExecutionContext
  ) {
    const bucket = env.SEARCH_BUCKET;
    const changed = new Set<string>();

    for await (const msg of batch.messages) {
      const { config, document, index } = msg.body;
      const indexFile = indices.has(index)
        ? indices.get(index)?.index
        : await loadIndex(await bucket.get(index), config);
      if (!indexFile) continue;
      changed.add(index);
      try {
        indexFile.add(document);
      } catch (e) {
        console.log("replacing existing document");
        indexFile.replace(document);
      }
      indices.set(index, { index: indexFile, config });
    }

    // saving the index changes
    for await (const changedIndex of changed) {
      if (!indices.has(changedIndex)) continue;
      const { index, config } = indices.get(changedIndex) as {
        index: MiniSearch<any>;
        config: Options<any>;
      };

      await bucket.put(changedIndex, await saveIndex(index, config));
    }

    batch.ackAll();
  },
};
