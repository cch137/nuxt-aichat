export default async function (
  answer: string | undefined,
  complete = true
) {
  try {
    // @ts-ignore
    if (!answer) {
      return { error: 'No answer found', complete }
    }
    return { answer, complete }
  } catch (err) {
    console.error(err)
    return { error: 'Request failed', complete }
  }
}
