import { defineEventHandler, readBody } from 'h3';
import { c as curva } from './index2.mjs';
import 'dotenv';
import 'sequelize';
import './sogouTranslate.mjs';
import 'crypto-js/md5.js';
import 'axios';
import 'cookie';
import './index3.mjs';
import 'mongoose';
import './str.mjs';
import './crawler.mjs';
import 'turndown';
import '@joplin/turndown-plugin-gfm';
import 'cheerio';
import 'googlethis';
import './message.mjs';

const suggestions_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const question = body == null ? void 0 : body.question;
  const amout = (body == null ? void 0 : body.amout) || void 0;
  if (typeof question !== "string") {
    return { error: 1 };
  }
  return await curva.suggestions(question, amout);
});

export { suggestions_post as default };
//# sourceMappingURL=suggestions.post.mjs.map
