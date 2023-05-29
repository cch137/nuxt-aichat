import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, result: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `The current time is ${time}. Please provide a concise summary from the webpage that can help you answer a question. Organize the information into a paragraph instead of bullet points. When analyzing the webpage, focus on extracting key points and ignore irrelevant information such as headers, footers, ads, or other unrelated content.\nThe question: ${question}\n\nWebpage results (summarize in the language of the webpage, never in the language of the question, do not mark the source): ${result}`
}
