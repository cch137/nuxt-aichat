import { defineEventHandler, readBody } from 'h3';
import { parse } from 'cookie';
import { r as read } from './token.mjs';
import { m as message } from './index.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import 'mongoose';
import 'dotenv';

const history_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const conv = (_a = await readBody(event)) == null ? void 0 : _a.id;
  const rawCookie = (_d = (_c = (_b = event == null ? void 0 : event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.headers) == null ? void 0 : _d.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (!user) {
    return {
      error: 1
    };
  }
  const messages = (await message.find({
    user,
    conv
  }, {
    _id: 1,
    Q: 1,
    A: 1
  }).lean()).map((doc) => {
    const _doc = {
      ...doc,
      t: doc._id.getTimestamp().getTime()
    };
    delete _doc._id;
    return _doc;
  });
  return messages;
});

export { history_post as default };
//# sourceMappingURL=history.post.mjs.map
