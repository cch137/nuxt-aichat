interface ArchivedChatMessage {
  Q: string;
  A: string;
  id: string;
  t: number;
  queries?: string[];
  urls?: string[];
  dt?: number;
}

interface CurvaStandardResponse {
  question?: string;
  answer: string;
  isContinueGenerate?: boolean;
  queries?: string[] | undefined;
  urls?: string[] | undefined;
  error?: string | undefined;
  dt?: number;
  id?: string;
  version?: string;
}

export type { ArchivedChatMessage, CurvaStandardResponse };
