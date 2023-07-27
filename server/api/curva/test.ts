import { config } from 'dotenv'
config()

export default defineEventHandler(async (event) => {
  return {
    status: 'OK'
  }
})
