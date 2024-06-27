import str from "~/utils/str";
import { round } from "~/utils/round";

export default function (
  date: Date,
  format = "yyyy-MM-dd HH:mm:ss",
  isUTC = false
) {
  const addLeadingZeros = (val: number, len = 2) =>
    val.toString().padStart(len, "0");
  const dateProperties = isUTC
    ? {
        y: date.getUTCFullYear(),
        M: date.getUTCMonth() + 1,
        d: date.getUTCDate(),
        w: date.getUTCDay(),
        H: date.getUTCHours(),
        m: date.getUTCMinutes(),
        s: date.getUTCSeconds(),
        f: date.getUTCMilliseconds(),
      }
    : {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        w: date.getDay(),
        H: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        f: date.getMilliseconds(),
      };
  const T = dateProperties.H < 12 ? "AM" : "PM";
  const _h = dateProperties.H % 12;
  const h = _h === 0 ? 12 : _h;
  format = format
    .replace(/yyyy/g, str(dateProperties.y))
    .replace(/yy/g, `${dateProperties.y}`.substring(2, 4))
    .replace(/y/g, str(dateProperties.y))
    .replace(/HH/g, addLeadingZeros(dateProperties.H))
    .replace(/H/g, str(dateProperties.H))
    .replace(/hh/g, addLeadingZeros(h))
    .replace(/h/g, str(h))
    .replace(/mm/g, addLeadingZeros(dateProperties.m))
    .replace(/m/g, str(dateProperties.m))
    .replace(/ss/g, addLeadingZeros(dateProperties.s))
    .replace(/s/g, str(dateProperties.s))
    .replace(/fff/g, str(round(dateProperties.f)))
    .replace(/ff/g, str(round(dateProperties.f / 10)))
    .replace(/f/g, str(round(dateProperties.f / 100)))
    .replace(/TT/gi, T)
    .replace(/T/gi, T.charAt(0))
    .replace(
      /dddd/g,
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dateProperties.w]
    )
    .replace(
      /ddd/g,
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateProperties.w]
    )
    .replace(/dd/g, addLeadingZeros(dateProperties.d))
    .replace(/d/g, str(dateProperties.d));
  const formatBefore = format;
  format = format
    .replace(
      /MMMM/g,
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][dateProperties.M - 1]
    )
    .replace(
      /MMM/g,
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][dateProperties.M - 1]
    );
  if (format !== formatBefore) {
    return format;
  }
  return format
    .replace(/MM/g, addLeadingZeros(dateProperties.M))
    .replace(/M/g, str(dateProperties.M));
}
