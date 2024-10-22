import { d as defineEventHandler } from './nitro/node-server.mjs';
import { s as streamManager } from './streamManager.mjs';
import { a as getUidByToken } from './token.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import './random.mjs';
import 'crypto-js/sha3.js';
import 'cookie';
import 'crypto-js/md5.js';

const stream_post = defineEventHandler(async (event) => {
  if (!getUidByToken(event)) {
    return { error: 1 };
  }
  const res = event.node.res;
  const stream = streamManager.create();
  res.writeHead(200, "OK", {
    "Content-Type": "text/event-stream",
    "Transfer-Encoding": "chunked",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write(stream.id);
  stream.pipe({
    data: (chunk) => res.write(chunk),
    end: () => {
      res.end(), stream.destroy();
    }
  });
  return;
});

export { stream_post as default };
//# sourceMappingURL=stream.post.mjs.map
