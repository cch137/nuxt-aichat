import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
Analyze the user question to extract URLs and short phrases that require search engine queries.
You must adhere to the following guidelines:
- Limit the queries to a maximum of 3 short phrases, only conducting necessary searches; otherwise, no action is needed.
- Avoid redundant queries with similar meanings; only search for things or news that you do not know.
- If the inquiry is not in English, ensure at least 1 query phrase is in English.
- URLs should only come from the user question; if a URL is already provided, there is no need to use a search engine unless explicitly requested by the user.
- Your queries should not seek answers that require reflection or summarization; they should serve as references for you.

Consider yourself an API and refrain from making additional comments. You only need to respond with a JSON object in the following format: \`{ "urls": [], "queries": [] }\`

Here is the question:
${question}`
}
