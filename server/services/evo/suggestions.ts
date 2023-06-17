import client from './client'

export default async function (question: string, amount?: number) {
  const answer = (await client.gpt('gpt4_t00', `You are required to predict the user's next question based on their previous question (provide ${amount || 8} suggestions).
If the user's previous question doesn't have a specific topic, you need to anticipate potential topics the user might bring up and predict some principles or phenomena they might ask you to explain.
You don't need to answer the user's question. Consider yourself as an API and refrain from making any additional comments. Simply reply with a JSON format \`{ "suggestions": [] }\`. Here is the user's question: ${question}`, ''))?.answer as string
  return JSON.parse(answer.substring(answer.indexOf('{'), answer.lastIndexOf('}') + 1)).suggestions as string[]
}
