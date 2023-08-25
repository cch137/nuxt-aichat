import { defineEventHandler } from 'h3';
import { s as streamManager } from './streamManager.mjs';
import './random.mjs';
import 'crypto-js/sha3.js';

const stream = defineEventHandler(async (event) => {
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

export { stream as default };
//# sourceMappingURL=stream.mjs.map
