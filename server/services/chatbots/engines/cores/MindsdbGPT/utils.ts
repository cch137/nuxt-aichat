function getAllModelsSetups () {
  // temperature tokens
  const models = new Map<string, { model_name: string, max_tokens: number, temperature: number }>()
  for (const data of [[3, [1, 2, 3]], [4, [1, 2, 3, 4, 5, 6, 7]]]) {
    for (let t = 0; t <= 10; t++) {
      const v = data[0] as number
      const maxTokensRange = data[1] as number[]
      for (const maxTokens of maxTokensRange) {
        models.set(`gpt${v}_t${t.toString().padStart(2, '0')}_${maxTokens}k`, {
          model_name: v === 3 ? 'gpt-3.5-turbo' : 'gpt-4',
          max_tokens: (v === 3 ? 4096 : 8192) - (maxTokens * 1024),
          temperature: t / 10
        })
      }
    }
  }
  return models
}

function getAllCreateCommand () {
  const setups = getAllModelsSetups()
  const commands: string[] = []
  setups.forEach((setup, modelName) => {
    commands.push(`CREATE MODEL mindsdb.${modelName}
PREDICT answer
USING
engine = 'openai',
temperature = ${setup.temperature},
model_name = '${setup.model_name}',
max_tokens= ${setup.max_tokens},
question_column = 'question',
context_column = 'context'
`)
  })
  return commands
}

function getAllDropCommand () {
  const setups = getAllModelsSetups()
  const commands: string[] = []
  setups.forEach((setup, modelName) => {
    commands.push(`DROP MODEL mindsdb.${modelName}`)
  })
  return commands
}

export {
  getAllCreateCommand,
  getAllDropCommand
}
