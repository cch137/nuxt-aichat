import formatDate from '~/utils/formatDate'

export default function (userTimeZone = 0) {
  const now = new Date()
  return formatDate(new Date(
    now.getTime() + userTimeZone * 60 * 60 * 1000 -
    (now.getTimezoneOffset() / -60) * 60 * 60 * 1000
  ))
}
