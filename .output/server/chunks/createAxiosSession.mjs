import axios from 'axios';
import { serialize, parse } from 'cookie';

function createAxiosSession(headers = {}) {
  const session = axios.create({
    withCredentials: true,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      ...headers
    }
  });
  const cookieJar = {};
  session.interceptors.request.use(async (config) => {
    let serializedCookies = "";
    for (const name in cookieJar) {
      serializedCookies += serialize(name, cookieJar[name]) + "; ";
    }
    config.headers.Cookie = serializedCookies;
    return config;
  });
  session.interceptors.response.use((response) => {
    const setCookieHeaders = response.headers["set-cookie"];
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.map((c) => parse(c.split(";")[0]));
      for (const cookie of cookies) {
        for (const name in cookie) {
          cookieJar[name] = cookie[name];
        }
      }
    }
    return response;
  });
  return session;
}

export { createAxiosSession as c };
//# sourceMappingURL=createAxiosSession.mjs.map
