import MiniSearch, { Options } from "minisearch";
import { SerializedIndex } from "./types";
import { gunzipSync, gzipSync, strToU8, strFromU8 } from "fflate";

export async function loadIndex(
  serialized: R2ObjectBody | null,
  config?: Options<any>
) {
  if (!serialized) {
    if (!config) throw new Error("No config provided");
    return new MiniSearch(config);
  }
  const deserialized: SerializedIndex = JSON.parse(await serialized.text());
  console.log("initializing with config: ", deserialized.config);
  const index = MiniSearch.loadJSON(deserialized.values, deserialized.config);
  return index;
}

export async function saveIndex(
  index: MiniSearch<any>,
  config: Options<any>
): Promise<string> {
  const serialized: SerializedIndex = {
    config,
    values: JSON.stringify(index.toJSON()),
  };

  return JSON.stringify(serialized);
}
