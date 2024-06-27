export default async function (question: string, amount?: number) {
  return [];
  // const answer = (await client.gpt('gpt4_t00', `Consider yourself as an API and refrain from making any additional comments. Simply reply with a JSON format \`{ "suggestions": [] }\`. You are required to predict the user's next question based on their previous question (provide ${amount || 8} suggestions). If the question doesn't have a specific topic, you need to anticipate potential topics the user might bring up and predict some principles or phenomena they might ask you to explain. You do not need to answer the question. Here is the question: ${question || 'Hi'}`, ''))?.answer as string
  // return JSON.parse(answer.substring(answer.indexOf('{'), answer.lastIndexOf('}') + 1)).suggestions as string[]
}
