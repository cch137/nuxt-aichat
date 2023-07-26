interface ChatbotEngine {
  client?: any
  init (): Promise<true>
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
