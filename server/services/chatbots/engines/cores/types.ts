interface ChatbotEngine {
  client?: any
  init (): Promise<true>
  ask (questionOrMessages: string | OpenAIMessage[], options: Record<string, any>): Promise<{
    answer: string,
    error?: string,
    queries?: string[],
    urls?: string[]
  }>
  setup (): any
  kill (): void
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant',
  content: string
}

export type {
  ChatbotEngine,
  OpenAIMessage
}
