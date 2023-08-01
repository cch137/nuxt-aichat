import { encode } from 'gpt-3-encoder'

function estimateTokens (...texts: string[]): number {
  return encode(texts.join('\n')).length
}

export default estimateTokens
