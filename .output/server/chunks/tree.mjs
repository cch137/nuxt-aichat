import { defineEventHandler, readBody } from 'h3';
import './index3.mjs';
import { getAllKey, getDeletedKey } from './keys.mjs';
import { m as message } from './message.mjs';
import 'dotenv';
import 'crypto';
import 'url';
import 'bson';
import 'timers';
import 'util';
import 'stream';
import 'events';
import 'dns';
import 'fs';
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'http';
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
