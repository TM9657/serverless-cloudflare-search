export interface SearchQueueMessage {
  index: string;
  config: {
    id: string;
    fields: string[];
  };
  document: any;
}
