import calculateAlphanumericLength from '~/utils/calculateAlphanumericLength'
import detectLanguageDistribution from '~/utils/detectLanguageDistribution'

function estimateTokens (text: string): number {
  const length = calculateAlphanumericLength(text)
  const languageDistribution = detectLanguageDistribution(text)
  let tokens = 0
  for (const languageCode in languageDistribution) {
    switch (languageCode) {
      case 'en':
        tokens += (languageDistribution[languageCode] * length) / 4
        break
      case 'zh':
      case 'ja':
      case 'ko':
        tokens += (languageDistribution[languageCode] * length) / 0.5
        break
      default:
        tokens += (languageDistribution[languageCode] * length) / 0.75
    }
  }
  return tokens
}

export default estimateTokens
