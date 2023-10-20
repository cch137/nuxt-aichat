import { d as defineEventHandler, r as readBody } from './nitro/node-server.mjs';
import './index2.mjs';
import { getAllKey, getDeletedKey } from './keys.mjs';
import { m as message } from './message.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'dotenv';
import 'crypto';
import './rollup/_commonjsHelpers.mjs';
import 'http';
import 'url';
import 'bson';
import 'timers';
import 'util';
import 'stream';
import 'events';
import 'dns';
import 'mongodb-connection-string-url';
import 'os';
import 'process';
import 'zlib';
import 'net';
import 'socks';
import 'tls';
import 'mongoose';

const tree = defineEventHandler(async (event) => {
  var _a;
  const key = (_a = await readBody(event)) == null ? void 0 : _a.key;
  if (key === getAllKey) {
    return await message.aggregate([
      {
        $group: {
          _id: "$uid",
          conv: { $addToSet: "$conv" }
        }
      },
      {
        $project: {
          _id: 0,
          uid: "$_id",
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
          _id: "$uid",
          conv: { $addToSet: "$conv" }
        }
      },
      {
        $project: {
          _id: 0,
          uid: "$_id",
          conv: 1
        }
      }
    ]).exec();
  }
  return [];
});

export { tree as default };
//# sourceMappingURL=tree.mjs.map
