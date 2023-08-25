import type { Tiktoken, TiktokenModel } from '@dqbd/tiktoken'
import { encoding_for_model } from '@dqbd/tiktoken'

const tiktokens = new Map<TiktokenModel,Tiktoken>([
  ['gpt-4', encoding_for_model('gpt-4')],
  ['gpt-3.5-turbo', encoding_for_model('gpt-3.5-turbo')],
])

function estimateTokens(_model: string = 'gpt-4', ...texts: string[]): number {
  _model = (_model || '').toLowerCase() || 'gpt-4'
  const model = _model.includes('gpt3') || _model.includes('gpt-3')
    ? 'gpt-3.5-turbo'
    : 'gpt-4'
  return (tiktokens.get(model) || tiktokens.get('gpt-4'))!.encode(texts.join('\n')).length
}

export default estimateTokens
