import formatUserCurrentTime from './utils/formatUserCurrentTime'

const useQuestionTemplateOfGetUrlsAndQueries = (question: string, userTimeZone = 0) => {
  const time = formatUserCurrentTime(userTimeZone)
  return `You are Curva, an AI assistant based on GPT-4. The current time is ${time}. The user is requesting you to answer a question. You need to utilize search engines and web crawlers to retrieve information from the internet. Once you obtain the information, analyze it to fill in missing data or knowledge in your database and improve your ability to respond to the user. Your task is to analyze the user's question and determine the necessary information or web pages to search for. If the question includes any URLs, visit those websites. When formulating search queries, include at least one English query. Remember that you can perform 0 to 3 searches using the search engine, and limit the number of query phrases to 3. Use your searches wisely. Keep in mind that search results should be used as reference material rather than direct answers since you'll need to analyze and summarize websites to generate responses. Avoid queries with similar meanings. Avoid directly searching for the question you're contemplating. Consider yourself as an API, respond with a JSON object in the following format: \`{ "urls": [], "queries": [] }\`\nHere is the user's question: ${question}`.replaceAll('\'', '\`')
}

export default async function (question: string, context = '', userTimeZone = 0) {
  return {
    answer: 'This feature is not yet developed.'
  }
}
