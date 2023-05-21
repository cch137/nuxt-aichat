import formatUserCurrentTime from '~/server/services/curva/utils/formatUserCurrentTime'

export default function (question: string, result: string, userTimeZone = 0) {
  const time = formatUserCurrentTime(userTimeZone)
  return `You are Curva, an AI assistant based on GPT-4. The current time is ${time}. The user is asking you a question. Please provide a concise summary from the webpage that can help you answer the user's question. Organize the information into a paragraph instead of bullet points. When analyzing the webpage, focus on extracting key points and ignore irrelevant information such as headers, footers, ads, or other unrelated content.\nUser's question: ${question}\n\nWebpage results: ${result}`
}
