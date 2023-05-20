import { defineEventHandler, readBody } from 'h3';
import { m as message } from './index.mjs';
import { getAllKey, getDeletedKey } from './keys.mjs';
import 'mongoose';
import 'dotenv';

const tree = defineEventHandler(async (event) => {
  var _a;
  const key = (_a = await readBody(event)) == null ? void 0 : _a.key;
  if (key === getAllKey) {
    return await message.aggregate([
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
  }
  if (key === getDeletedKey) {
    return await message.aggregate([
      {
        $match: {
          "conv": { $regex: "^~" }
        }
      },
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
  }
  return [];
});

export { tree as default };
//# sourceMappingURL=tree.mjs.map
