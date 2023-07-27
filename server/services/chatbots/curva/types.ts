interface ArchivedChatMessage {
  Q: string;
  A: string;
  id: string;
  t: number;
  queries?: string[];
  urls?: string[];
  dt?: number;
}

export type {
  ArchivedChatMessage
}
