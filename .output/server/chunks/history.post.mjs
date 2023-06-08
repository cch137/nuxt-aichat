import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import './index3.mjs';
import { m as message } from './message.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './str.mjs';
import 'dotenv';
import 'mongoose';

async function getHistory(user, conv) {
  if (!(user && conv)) {
    return [];
  }
  return (await message.find({
    user,
    conv
  }, {
    _id: 1,
    Q: 1,
    A: 1,
    queries: 1,
    urls: 1,
    dt: 1
  }).sort({ createdAt: 1 })).map((doc) => ({
    Q: doc.Q,
    A: doc.A,
    queries: doc.queries,
    urls: doc.urls,
    dt: doc.dt,
    t: doc._id.getTimestamp().getTime()
  }));
}

const history_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const rawCookie = (_d = (_c = (_b = event == null ? void 0 : event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.headers) == null ? void 0 : _d.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (!user) {
    return { error: 1 };
  }
  try {
    return await getHistory(user, conv);
  } catch {
    return { error: 2 };
  }
});

export { history_post as default };
//# sourceMappingURL=history.post.mjs.map
