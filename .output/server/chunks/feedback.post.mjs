import { defineEventHandler, readBody } from 'h3';
import { m as mailer } from './mailer.mjs';
import { a as getUidByToken } from './token.mjs';
import 'nodemailer';
import 'dotenv';
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';

const appName = "CH4";

const feedback_post = defineEventHandler(async function(event) {
  const uid = getUidByToken(event);
  if (!uid) {
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
