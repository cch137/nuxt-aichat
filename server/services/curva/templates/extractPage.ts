import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, result: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `User current time: ${time}
Summarize the following information for use in responding to user question.
Your responses must adhere to the following guidelines:
- Use references where possible and answer in detail.
- Ensure the overall coherence and consistency of the responses.
- Ensure that the release time of news is relevant to the responses, avoiding outdated information.
- The content may come from web pages, and you should focus on extracting useful information while disregarding potential headers, footers, advertisements, or other irrelevant content.
- Summarize using the language of the data source itself, rather than the language used by the inquirer.
- Avoid mentioning the name of the current web page in the summary.

User question:
${question}

The references:
${result}`
}
