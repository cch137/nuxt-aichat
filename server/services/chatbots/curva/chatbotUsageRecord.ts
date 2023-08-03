let minSizeAllowedToBeDeleted = 1000
let ageAllowedToBeDeleted = 5 * 60 * 1000

interface ChatbotUsageRecordItem {
  ip: string,
  conv: string,
  user: string,
  model: string,
  error: string
  t: number,
}

const usageRecord: ChatbotUsageRecordItem[] = []

let lastAdded = 0

const chatbotUsageRecord = {
  add (item: ChatbotUsageRecordItem) {
    usageRecord.unshift(item)
    const now = Date.now()
    if (lastAdded - now > 1000) {
      setTimeout(() => {
        chatbotUsageRecord.maintain()
      }, 0)
    }
    lastAdded = now
  },
  maintain () {
    // @ts-ignore
    while (usageRecord.length > minSizeAllowedToBeDeleted && (Date.now() - usageRecord.at(-1).t) > ageAllowedToBeDeleted) {
      usageRecord.pop()
    }
  },
  getItems () {
    return usageRecord
  }
}

export type {
  ChatbotUsageRecordItem
}

export default chatbotUsageRecord
