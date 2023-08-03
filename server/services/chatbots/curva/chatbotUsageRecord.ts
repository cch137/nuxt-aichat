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

const usageRecord: ChatbotUsageRecordItem[] = [
  {
    "ip": "::1",
    "user": "Sy2RIxoAA0zpSO8r",
    "conv": "2DOoI4Ek",
    "model": "claude-2-web",
    "error": "{\"error\":{\"message\":\"bad status code: 500\",\"type\":\"one_api_error\",\"param\":\"\",\"code\":\"bad_status_code\"}}",
    "t": 1691055806953
  },
  {
    "ip": "::1",
    "user": "Sy2RIxoAA0zpSO8r",
    "conv": "2DOoI4Ek",
    "model": "claude-2-web",
    "error": "",
    "t": 1691055859264
  }
]

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
