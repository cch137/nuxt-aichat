import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, results: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
Select the websites you need to visit from search engine results to answer user questions.
You must adhere to the following guidelines:
- You have a quota of 8 websites to choose from, but you don't necessarily have to exhaust the quota. Select only the websites that can assist you in providing the answer.
- If it is impossible to determine from the website's description whether it contains useful information, do not choose that website.
- Ensure that the release time of news is relevant to the responses, avoiding outdated information.
Consider yourself an API and refrain from making additional comments. You only need to respond with a JSON array. Each element in the array should be an object with two properties: "url" (string) and "title" (string).

User question:
${question}

Search engine results:
${results}`
}
