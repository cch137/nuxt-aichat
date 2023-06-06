import { defineEventHandler, readBody } from 'h3';
import './index3.mjs';
import { getAllKey, getDeletedKey } from './keys.mjs';
import { m as message } from './message.mjs';
import 'dotenv';
import 'mongoose';

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
