import { defineEventHandler, readBody } from 'h3';
import './index.mjs';
import { getAllKey, getDeletedKey } from './keys.mjs';
import { m as message } from './message.mjs';
import 'dotenv';
import 'mongoose';

const messages = defineEventHandler(async (event) => {
  var _a;
  const key = (_a = await readBody(event)) == null ? void 0 : _a.key;
  if (!(key === getAllKey || key === getDeletedKey)) {
    return [];
  }
  const messages = await message.aggregate([
    {
      $group: {
        _id: "$user",
        conv: { $addToSet: { conv: "$conv", Q: "$Q", A: "$A" } }
      }
    },
    {
      $project: {
        _id: 0,
        user: "$_id",
        conv: 1,
        Q: 1,
        A: 1
      }
    }
  ]).exec();
  if (key === getAllKey) {
    return messages;
  }
  if (key === getDeletedKey) {
    return messages.filter((u) => u.user.startsWith("~"));
  }
  return [];
});

export { messages as default };
//# sourceMappingURL=messages.mjs.map
