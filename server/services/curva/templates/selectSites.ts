import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, results: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
Select the websites you need to visit from search engine results to answer user questions.
You must adhere to the following guidelines:
- You have a quota of 8 websites to choose from. Minimize the usage of quotas as much as possible. Select only the necessary websites.
- If it is impossible to determine from the description of website whether it contains useful information, do not choose that website.
- You can choose websites that are in a different language than the question.
- Ensure that the release time of the news is relevant to the question asked to avoid outdated information.
Consider yourself an API and refrain from making additional comments. You only need to respond with a JSON array. Each element in the array should be an object with two properties: "url" (string) and "title" (string).

User question:
${question}

Search engine results:
${results}`
}
