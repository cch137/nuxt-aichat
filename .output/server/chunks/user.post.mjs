import { defineEventHandler } from 'h3';
import { a as getUidByToken, m as mask } from './token.mjs';
import 'cookie';
import 'crypto-js/sha3.js';
import 'crypto-js/md5.js';
import './random.mjs';

const user_post = defineEventHandler(async (event) => {
  const uid = getUidByToken(event);
  return mask(uid || "", "64w", 1, 4896).substring(1);
});

export { user_post as default };
//# sourceMappingURL=user.post.mjs.map
