import qs from "qs";

function validKeyValuePair(key: string, value: string) {
  switch (key) {
    case "model":
      if (
        ["gpt3", "gpt4", "gpt-web", "claude-2", "gemini-pro"].includes(value)
      ) {
        return true;
      }
      break;
    case "temperature":
      if (typeof value === "number") {
        if (value >= 0 && value <= 1) {
          return true;
        }
      }
      break;
    case "context":
      if (typeof value === "boolean") {
        return true;
      }
      break;
  }
  return false;
}

function tryParseJson(obj: any) {
  try {
    return JSON.parse(obj);
  } catch {
    return obj;
  }
}

function toStdConvConfig(obj: any): Record<string, any> {
  try {
    const resultObj: any = {};
    for (const key in obj) {
      const value = tryParseJson(obj[key]);
      if (validKeyValuePair(key, value)) {
        resultObj[key] = value;
      }
    }
    return resultObj;
  } catch {
    return {};
  }
}

function parseConvConfig(objString: string) {
  try {
    return toStdConvConfig(qs.parse(objString));
  } catch {
    return {};
  }
}

function stringifyConvConfig(obj: any) {
  try {
    return qs.stringify(toStdConvConfig(obj));
  } catch {
    return "";
  }
}

function toStdConvConfigString(configString: string) {
  return stringifyConvConfig(parseConvConfig(configString));
}

export { parseConvConfig, stringifyConvConfig, toStdConvConfigString };
