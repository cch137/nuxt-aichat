import { defineEventHandler, readBody } from 'h3';
import { m as mailer } from './mailer.mjs';
import { r as read } from './token.mjs';
import { parse } from 'cookie';
import 'nodemailer';
import 'dotenv';
import './troll.mjs';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';

const appName = "CH4";

const feedback_post = defineEventHandler(async function(event) {
  var _a, _b, _c;
  const rawCookie = (_c = (_b = (_a = event == null ? void 0 : event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.headers) == null ? void 0 : _c.cookie;
  const token = read(parse(typeof rawCookie === "string" ? rawCookie : "").token);
  const user = token == null ? void 0 : token.user;
  if (token === null || typeof user !== "string") {
    return { error: 0 };
  }
  const body = await readBody(event);
  if (!body) {
    return { error: 1 };
  }
  let { name, feedback } = body;
  name = (name || "").trim();
  feedback = (feedback || "").trim();
  if (!name || !feedback) {
    return { error: 2 };
  }
  mailer.sendText(
    process.env.NODEMAILER_EMAIL,
    `Feedback from ${appName}`,
    `Name: ${name}

Feedback:
${feedback}`
  );
  return {};
});

export { feedback_post as default };
//# sourceMappingURL=feedback.post.mjs.map
