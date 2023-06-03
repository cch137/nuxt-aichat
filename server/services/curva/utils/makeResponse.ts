import str from '~/utils/str'
import { log as logger } from '~/server/services/mongoose/index'

export default async function (
  answer: string | undefined,
  complete = true,
  props = {}
) {
  try {
    // @ts-ignore
    if (!answer) {
      return { error: 'No answer found', complete, ...props }
    }
    return { answer, complete, ...props }
  } catch (err) {
    logger.create({ type: 'error.makeResponse', text: str(err) })
    return { error: 'Request failed', complete, ...props }
  }
}
