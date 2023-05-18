import { defineEventHandler, readBody } from 'h3';
import { m as message } from './index.mjs';
import realKey from './key.mjs';
import 'mongoose';
import 'dotenv';

const tree = defineEventHandler(async (event) => {
  var _a;
  const key = (_a = await readBody(event)) == null ? void 0 : _a.key;
  if (key !== realKey) {
    return [];
  }
  const tree = await message.aggregate([
    {
      $group: {
        _id: "$user",
        conv: { $addToSet: "$conv" }
      }
    },
    {
      $project: {
        _id: 0,
        user: "$_id",
        conv: 1
      }
    }
  ]).exec();
  return tree;
});

export { tree as default };
//# sourceMappingURL=tree.mjs.map
