export default function (query: string, options?: { temperature?: number, maxTokens?: number }) {
  const temperature = options?.temperature === undefined ? 0.5 : options.temperature
  const temperatureSuffix = `_t${Math.round(Math.min(Math.max(0.5, 0), 1) * 10).toString().padStart(2, '0')}`
  const tokensSuffix =  
}