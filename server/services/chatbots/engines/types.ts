interface ChatbotEngine {
  client?: any
  init (): void
  ask (question: string, options: Record<string, any>): Promise<{
    answer: string,
    error?: string,
    queries?: string[],
    urls?: string[]
  }>
  kill (): void
}

export type {
  ChatbotEngine
}
