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
    console.error(err)
    return { error: 'Request failed', complete, ...props }
  }
}
