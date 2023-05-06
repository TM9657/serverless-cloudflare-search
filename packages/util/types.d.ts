import { Options } from "minisearch";

export interface SearchQueueMessage {
  index: string;
  config: SearchConfig;
  document: any;
}

export interface SerializedIndex {
  config: Options<any>;
  values: string;
}

export { Options, default as MiniSearch } from "minisearch";
